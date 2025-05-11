# nauka dockera z perspektywy backendowca

- [Perplexity](https://www.perplexity.ai/search/i-m-an-engineer-experienced-in-xGOLfVaxTmC1tUuBv9vn8A)

```
I'm an engineer experienced in .net.
But I don't have experience in containerization/docker and my knowledge in the area is poor. I don't yet know what I don't know.

I'm very experienced in programming and microsoft technologies in general, so you can relate to well known programming topics.

I want to go deep into containerization and docker and I want you to prepare a list of topics I should learn. Please group them by level (foundations, advanced, expert). Each topic should be something that people teach on courses or in other materials. The name should be rather succinct, and followed by short, 1-sentence explanation, which outlines WHY the topic is important to learn

---------------------------------------------------------

Now let's walk into the foundations. I have no idea how docker works, so please outline the most important aspects of "Docker Fundamentals" and "Docker's architecture" from foundations/point 1 above. I want to grab the necessary basics.

Please draw some basic scenarios of usage of docker: what would I do, why would I do it, what is the problem I'm solving, etc. If a docker command/tool applies, also include that.

Be precise and hollistic.

---------------------------------------------------------


At this point, I don't feel I understand what's going on in the most basic example. Please go step by step and explain what happens in the following:

```
# Create Dockerfile for .NET Core app
FROM mcr.microsoft.com/dotnet/sdk:8.0
WORKDIR /app
COPY . .
RUN dotnet restore
CMD ["dotnet", "watch"]

# Build and run
docker build -t dotnet-dev .
docker run -v ${PWD}:/app -p 5000:5000 dotnet-dev

---------------------------------------------------------

I still don't get the difference between an image and a container. Please explain it in following styles for me:

- explain like i'm 5
- explain like I'm 15 years old
- explain to me like a developer (who just doesn't understand the topic).

---------------------------------------------------------

Ok, I'm starting to get the difference. But I don't see the usecases yet. Can you please provide several typical usecases for images/containers (or both) where they're used, and can you generate mermaid diagrams that illustrate it?

I want to understand the practical aspect of the distinction. Also, I want to see what practical things one can do with docker images/containers.

---------------------------------------------------------

is there any docker related tooling that would help me learn it / master it effectively? Just apart from installing docker itself - what should I consider installing additionally?

---------------------------------------------------------

hmm, that seems like a lot. Please recommend me a set of 3 tools I should start with. Preferably not alternatives, but things I could use together. And not necessarily things for super experts - I'm a newbie...

---------------------------------------------------------

There's a "Multi-stage Builds" point in "advanced" section. Please tell me more about it. Include code samples. Explain, why it matters. Explain, what's the problem we're solving.
```