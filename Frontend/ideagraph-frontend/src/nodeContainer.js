import { Handle, Position } from 'reactflow';

const handleStyle = { left: 10 };

function nodeContainer({ data, isConnectable }) {

    const x = JSON.parse(JSON.stringify(data));

  return (
    <div class="mainBody">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle
        type="source"
        position={Position.Bottom}
        id={x["sourceHandle"]}
        style={handleStyle}
        isConnectable={isConnectable}
      />
      {/* <Handle type="source" position={Position.Bottom} id={x["sourceHandle"]} isConnectable={isConnectable} /> */}

        <div class="container">
            
                <img src="connection_symbol.svg"></img>
                <span class="titleText">{x.label}</span>
         
        </div>

        <div class="mainPara">
            
            <p class="textMain">

              {x.payload}       
                   
            </p>
        
        </div>

        {/* <div class="mainLower">

            <div class="categoryOne">

                <p>category</p>

            </div>

            <div class="categoryTwo">

                <p>class</p>

            </div>

            <div class="imageCategory">

                <img src="images/Group 30@2x.png"></img>

            </div>
            

        </div> */}

    </div>
  );
}

export default nodeContainer;
