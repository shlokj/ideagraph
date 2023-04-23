# LA Hacks 2023 - IdeaGraph

## Team Members

Arjun Raj Loomba, Shubh Kathuria, Yash Kothari, Shlok Jhawar

## Inspiration

Imagine you're sitting at your favorite coffee shop after a tiring day of classes. You're going through your notes but there's so much that you just learned that your notes don't immediately make sense! You know what I mean if you’ve ever taken an Eggert class. The ideas and concepts are so fresh in your mind, but they're a bit all over the place. You try to organize your notes. Maybe you fervently type them out or your draw them out on a piece of paper. But alas - disappointment! You have to keep going back to your notes over and over again to find the key ideas in your notes and struggle to learn much more than what you’ve written down.

IdeaGraph is designed to co-pilot over your notes, your next startup idea, your journal entry. Sit down, speak, and let IdeaGraph stream your consciousness for you.

## What it does

IdeaGraph can listen to you, a recording of you, or go through a text file. Simply upload your notes or speak to the app and have a comprehensive mind map chalked out - yes, a literal mind map.

We designed IdeaGraph with the intention that it be used in any area - be it learning content at school, evaluating a startup idea, or even planning an itinerary for your next vacation. IdeaGraph’s capability to understand context and materialize a useful map help users understand there own ideas better.

We also acknowledged that ideas can almost always be improved with more information and creativity. That’s why we built a Branch Out feature - allowing users to benefit from the colossal amounts of training data that goes into LLMs. With this, students can learn in more depth, entrepreneurs can better predict the fit of their product, tourists can discover new places, and the list goes on.

## How we built it

We built it around Cohere APIs at its core, especially using Embed to do semantic search, and Co.Generate to generate summaries for each node’s key phrase summary and the auto-complete feature that adds to nodes. We also used generative AI to fit the node’s main point into an emoji and showcase it for every node just for more context and aesthetic appeal. We created the graph using ReactFlow, Dagre, and D3 algorithms to properly space each node and avoid overlapping issues. We built the website on React (Front-End) and Flask (Back-End).

## Challenges we ran into
Customizing the ReactFlow elements to follow are CSS designs and html structure was hard especially since we did not have access to their Pro version. Also figuring out the algorithm to space the nodes took considerable effort. Cohere’s APIs were easy to follow but calibrating the prompts to get the desired effort took time too. Lastly, integrating the front-end with the back-end took considerable communication skills and effort from all team members which proved to be a great bonding experience as well. Learning all technologies from the ground up to execute our idea was also considerably challenging since a lot of them, we used for the very first time. 

## Accomplishments that we're proud of
- Completing the project within the time constraints
- Integrating Cohere at every level to create the graph, generate nodes, etc. to meaningfully showcase ideas in a structured graph
- Integrating the dagre algorithms to properly space each node and avoid overlapping between nodes
- Creating a dedicated front and back end that matches the concepts of theory
- Creating all our designs on Figma that are extremely simple yet aesthetically pleasing
- Using Whisper to do speech to text recognition as a valid way of creating the IdeaGraph

## What we learned
**NLP**:
Going in, none of us were familiar with the core technology. We spent hours reading documentation and understanding how exactly models process human language.

**Visualizing a graph programmatically**
We had to figure out how to create custom nodes for the exact kind of graph that we wanted. This involved hours of trial and error, six Red Bull cans, and almost no sleep, but we got through it, and we have a brilliant final product to show for it!

## What's next for IdeaGraph

We believe that IdeaGraph has the potential to become an everyday tool for not just millions of school students but learners across all walks of life - we aim to keep the definition of learning as broad as possible. As NLP progresses, it will be able to understand context and generate thoughts tailored to your style of thinking. By using more generative AI models, we can bring life to your thoughts with images, videos, detailed explanations…
