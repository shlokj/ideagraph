import {
  Button,
  CircularProgress,
  Dialog,
  Grid,
  IconButton,
  ListItemButton,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { Drawer } from "@mui/material";
import dagre from "dagre";
import { useNavigate } from "react-router";
import axios from "axios";
import nodeContainer from "./nodeContainer.js";
import "./nodeContainer.css";
import "./drawer.css";
import drawerImage from "./abstract.png";

const nodeTypes = { nodeContainer: nodeContainer };

const styles = {
  mainDiv: {
    position: "relative",
    height: "100vh",
  },
  signOutButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: "1",
  },
  regenerateButton: {
    positon: "absolute",
    top: "10px",
    left: "1200px",
    zIndex: "1",
    margin: 0,
  },
  recordAudioButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: "1",
  },
  openToolbarButton: { position: "relative", top: "10px", right: "10px" },
  drawerDiv: { margin: "32px", width: "40vw" },
  sentenceDescription: { marginTop: "24px" },
  centerChildren: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f6f6f6",
  },
  autocompleteButton: {
    marginTop: "1rem",
    borderRadius: "25px",
    textTransform: "capitalize",
    fontWeight: "bold",
  },
  circProg: {
    marginLeft: "80px",
    marginRight: "80px",
    marginTop: "40px",
    marginBottom: "40px",
  },
};

const initialNodes = [
  // { id: "1" , position: { x: 0, y: 0 }, data: { label: "1", sourceHandle: "a" } },
  // { id: "2", position: { x: 0, y: 0 }, data: { label: "2", sourceHandle: "b" } },
  // { id: "3", position: { x: 0, y: 0 }, data: { label: "3", sourceHandle: "c" } },
];
const initialEdges = [
  // { id: "e1-2", source: "1", target: "2", sourceHandle: 'a' },
  // { id: "e1-3", source: "1", target: "3", sourceHandle: 'b' },
];

function Main() {
  const navigate = useNavigate();
  const [payload, setPayload] = useState(null); //payload is a sentence given based on the keyword
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(-1); // just have to make sure not to assign any node id -1
  const [signOutAux, setSignOutAux] = useState(false);

  const [isUploading, setUploading] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  //Action when a node is clicked
  const handleNodeClick = (event, element) => {
    console.log("Node clicked:", element.id);
    setSelectedNode(element.id);
    setDrawerOpen(true);
    // post request testing
    console.log("making post request");
    const text =
      "The temperature in Tokyo is currently 25 degrees. Celsius with a relative humidity of 70%. The population of Iceland is approximately 364,000 people as of 2021. The Mona Lisa painting was created by Leonardo da Vinci in the 16th century and is currently housed in the Louvre Museum in Paris. The highest peak in the world, Mount Everest, stands at 8,848 meters above sea level. The chemical formula for water is H2O, which consists of two hydrogen atoms and one oxygen atom. The average lifespan of a housefly is only around 30 days. The speed of light is approximately 299,792,458 meters per second in a vacuum.";
    const text1 = "I love Tokyo! it's my favourite city in the world";
    const dummyData = {
      text: "UCLA is an amazing university, I love UCLA!.",
      // text : "John",
    };
    const url = "http://localhost:8080/user_input";
    axios
      .post(url, dummyData)
      .then((response) => {
        console.log(response.data.nodes);
        setNodes(response.data.nodes);
        setEdges(response.data.edges);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //Action when an autocomplete request is made
  const sendAutocompleteRequest = () => {
    // Your axios POST request logic goes here
    const url = "http://localhost:8080/post/autocomplete"; // endpoint
    const data = {
      id: selectedNode, // The current node's id is passed
    };

    axios
      .post(url, data)
      .then((response) => {
        // Handle the response, e.g., update the UI with the autocomplete results
        console.log("Autocomplete response:", response.data.autocomplete_data);
        console.log("Edges: ", response.data.graph_data.edges);
        console.log("Nodes: ", response.data.graph_data.nodes);

        setNodes(response.data.graph_data.nodes);
        setEdges(response.data.graph_data.edges);

        //setting the payload object
        const payloadObj = response.data.graph_data.nodes_data.reduce(
          (acc, cur) => {
            const [key, value] = Object.entries(cur)[0];
            acc[key] = value;
            return acc;
          },
          {}
        );
        setPayload(payloadObj);
      })
      .catch((error) => {
        // Handle the error
        console.error("Autocomplete error:", error);
      });
  };

  useEffect(() => {
    const handleClick = (event) => {
      if (selectedNode && !event.target.closest(".react-flow__node")) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [selectedNode]);

  useEffect(() => {
    if (
      !localStorage.getItem("loggedIn") ||
      localStorage.getItem("loggedIn") === "false"
    ) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const graph = new dagre.graphlib.Graph();

    graph.setDefaultEdgeLabel(() => ({}));
    graph.setGraph({ rankdir: "TB" });

    nodes.forEach((node) => {
      graph.setNode(node.id, { width: 100, height: 100 });
    });

    edges.forEach((edge) => {
      graph.setEdge(edge.source, edge.target);
    });

    dagre.layout(graph);

    const newNodes = nodes.map((node) => ({
      ...node,
      position: {
        x: graph.node(node.id).x * 3.5,
        y: graph.node(node.id).y * 3.5,
      },
    }));

    setNodes(newNodes);
    // setEdges(edges)
  }, [edges]); // empty because we want to allow the user to move nodes around

  const layout = {
    name: "dagre",
    rankDir: "TB",
    nodeDimensionsIncludeLabels: true,
    animate: true,
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadButtonClick = () => {
    // Handle file upload logic here
    console.log("Selected file:", selectedFile);
  };

  function recordAndSendAudio() {
    // Access the user's microphone and start recording
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        const chunks = [];

        mediaRecorder.addEventListener("dataavailable", (event) => {
          chunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          const blob = new Blob(chunks, { type: "audio/wav" });

          // Send the audio data in a POST request
          const formData = new FormData();
          formData.append("audio", blob);

          fetch("/api/audio", {
            method: "POST",
            body: formData,
          })
            .then((response) => {
              console.log("Audio uploaded successfully!");
            })
            .catch((error) => {
              console.error("Error uploading audio:", error);
            });
        });

        // Record for 10 seconds
        mediaRecorder.start(10000);

        setTimeout(() => {
          mediaRecorder.stop();
        }, 10000);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  }

  return (
    <div style={styles.mainDiv}>
      <Drawer
        open={isDrawerOpen}
        ModalProps={{ BackdropProps: { invisible: true } }}
        style={styles.drawer}
      >
        <div class="mainDrawerBody">
          {selectedNode !== -1 ? (
            <>
              <div class="importText">
                <div class="textImportMain">
                  <h1>
                    {nodes.find((node) => node.id === selectedNode).data.label}
                  </h1>
                </div>

                <div class="buttonImportMain">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      sendAutocompleteRequest();
                    }}
                  >
                    Branch Out
                  </Button>
                </div>
              </div>

              <div class="subText">
                {payload && (
                  <p class="subTextText">{payload[selectedNode][1]}</p>
                )}
                ;
              </div>

              <div class="buttonContainers">
                <div class="buttonOne">
                  <button> Text One </button>
                </div>

                <div class="buttonTwo">
                  <button> Text Two </button>
                </div>

                <div class="buttonThree">
                  <button> Text Three </button>
                </div>

                <div class="buttonFour">
                  <button> Text Four </button>
                </div>
              </div>

              <div class="mainTextText">
                <p>{nodes.find((node) => node.id === "0").data.payload}</p>
              </div>

              {/* <div class="imgContainerContainer"> */}
              <img src={drawerImage}></img>
              {/* </div> */}

              {/* <Typography
            fontWeight="bold"
            style={styles.typoSpaced}
            sx={{ fontSize: "1.75rem" }}
         >
            {nodes.find((node) => node.id === selectedNode).data.label}
          </Typography>
          {payload && (
            <Typography
              style={styles.sentenceDescription}
              sx={{ fontSize: "1rem" }}
            >
              {payload[selectedNode]}
           </Typography>
          )} */}
            </>
          ) : (
            <Typography
              style={styles.sentenceDescription}
              sx={{ fontSize: "1rem" }}
            >
              A single-sentence description of this node will appear here. The
              sentence should be about this long.
            </Typography>
          )}
          {/* <Button
        variant="contained"
        color="primary"
        size="large"
        sx={styles.autocompleteButton}
        onClick={(e) => {
          e.stopPropagation();
          sendAutocompleteRequest();
        }}
      
      >
        Autocomplete
      </Button> */}
        </div>
      </Drawer>

      <Button
        variant="outlined"
        style={styles.regenerateButton}
        onClick={() => {
          const url = "http://localhost:8080/reset_graph";
          axios
            .get(url)
            .then((response) => {
              setNodes(initialNodes);
              setEdges(initialEdges);
            })
            .catch((error) => {
              console.error(error);
            });
        }}
      >
        Regenerate Graph
      </Button>

      <Button
        variant="outlined"
        style={styles.signOutButton}
        onClick={() => {
          setSignOutAux(!signOutAux);
          localStorage.setItem("loggedIn", false);
          navigate("/");
        }}
      >
        Sign Out
      </Button>

      {isUploading && (
        <Dialog open={true}>
          <CircularProgress style={styles.circProg} />
        </Dialog>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        layout={layout}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        onPaneClick={() => {
          setSelectedNode(-1);
          setDrawerOpen(false);
          console.log("onPaneClick");
        }}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
      {nodes.length === 0 && (
        <Grid
          container
          spacing={10}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "-65vh",
          }}
        >
          <IconButton
            style={{
              transform: "scale(1)",
              zIndex: "1",
            }}
          >
            <img src="mic_temp.svg"></img>
            <input
              type="file"
              name="fileName"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                opacity: 0,
                width: "100%",
                height: "100%",
                cursor: "pointer",
              }}
              onChange={(e) => {
                const file = e.target.files[0];
                const fileType = file.type;
                const endpoint =
                  fileType === "text/plain"
                    ? "http://127.0.0.1:8080/user_input/text/"
                    : fileType === "audio/wav"
                    ? "http://127.0.0.1:8080/user_input/audio/"
                    : null;
                if (endpoint) {
                  const formData = new FormData();
                  formData.append("fileName", file);
                  axios
                    .post(endpoint, formData)
                    .then((response) => {
                      console.log(response);
                      setNodes(response.data.nodes);
                      setEdges(response.data.edges);

                      //setting the payload object
                      const payloadObj = response.data.nodes_data.reduce(
                        (acc, cur) => {
                          const [key, value] = Object.entries(cur)[0];
                          acc[key] = value;
                          return acc;
                        },
                        {}
                      );
                      setPayload(payloadObj);
                      // Do something with the response data
                    })
                    .catch((error) => {
                      console.error(error);
                      // Handle the error
                    });
                } else {
                  // Handle unsupported file types
                }
              }}
            />
          </IconButton>
          <IconButton
            style={{
              transform: "scale()",
              zIndex: "1",
            }}
          >
            <img src="upload_temp.svg"></img>
            <input
              type="file"
              name="fileName"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                opacity: 0,
                width: "100%",
                height: "100%",
                cursor: "pointer",
              }}
              onChange={(e) => {
                const file = e.target.files[0];
                const fileType = file.type;
                const endpoint =
                  fileType === "text/plain"
                    ? "http://127.0.0.1:8080/user_input/text/"
                    : fileType === "audio/wav"
                    ? "http://127.0.0.1:8080/user_input/audio/"
                    : null;
                if (endpoint) {
                  setUploading(true);
                  const formData = new FormData();
                  formData.append("fileName", file);
                  axios
                    .post(endpoint, formData)
                    .then((response) => {
                      console.log(response);
                      setNodes(response.data.nodes);
                      setEdges(response.data.edges);

                      //setting the payload object
                      const payloadObj = response.data.nodes_data.reduce(
                        (acc, cur) => {
                          const [key, value] = Object.entries(cur)[0];
                          acc[key] = value;
                          return acc;
                        },
                        {}
                      );
                      setPayload(payloadObj);
                      setUploading(false);
                      // Do something with the response data
                    })
                    .catch((error) => {
                      console.error(error);
                      // Handle the error
                    });
                } else {
                  // Handle unsupported file types
                }
              }}
            />
          </IconButton>
        </Grid>
      )}
      {/* <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            Select a file to upload
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <input id="file-input" type="file" onChange={handleFileInputChange} />
          <Button variant="contained" component="span">
            Record audio
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUploadButtonClick}
            disabled={!selectedFile}
            fullWidth
          >
            Upload
          </Button>
        </Grid>
      </Grid> */}
    </div>
  );
}
export default Main;
