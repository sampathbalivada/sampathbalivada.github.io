<script>
    const publicationHost = "sampathbalivada.hashnode.dev"; 
    let posts = [];
    let x = 4;

    const GQL_QUERY = `
        query GetPublicationPosts($host: String!, $first: Int!) {
            publication(host: $host) {
                title
                posts(first: $first) {
                    edges {
                        node {
                            title
                            slug
                            brief
                            url
                        }
                    }
                    pageInfo {
                         hasNextPage
                         endCursor
                    }
                }
            }
        }
    `;

    async function fetchHashnodePosts() {
        try {
            const response = await fetch("https://gql.hashnode.com/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: GQL_QUERY,
                    variables: { 
                        host: publicationHost, 
                        first: 10
                    } 
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // Error handling for GraphQL errors
            if (result.errors) {
                console.error("GraphQL Errors:", result.errors);
                throw new Error("Failed to fetch posts due to GraphQL errors.");
            }
            
            // Check if publication and posts data exist
            if (result.data && result.data.publication && result.data.publication.posts) {
                // Extract the posts from the nested structure
                posts = result.data.publication.posts.edges.map(edge => edge.node);
                console.log("Fetched Posts:", posts); 
            } else {
                 console.warn("No publication or posts found for the given host:", publicationHost);
                 posts = [];
            }


        } catch (error) {
            console.error("Error fetching Hashnode posts:", error);
        }
    }
    
    fetchHashnodePosts();

</script>

<div>
    <h6 class="subtitle">latest blog posts:</h6>
    {#if posts.length == 0}
        {#each [1, 2, 3] as post}
            <h6>
                <a href="." target="." class="blog-post">loading...</a>
            </h6>
        {/each}
    {:else}
        {#each posts.slice(0, 3) as post, i}
            <h6>
                <a
                    href="https://blog.sampath.dev/{post.slug}"
                    target="_blank"
                    class="blog-post {i == 0 ? 'first' : ''}"
                    >> {post.title.toLowerCase()}</a
                >
            </h6>
        {/each}
    {/if}

    <h6>
        <a href="https://blog.sampath.dev" target="_blank" class="blog-link">
            view all blog posts
        </a>
    </h6>
</div>

<style>
    div {
        padding-left: 24px;
        border-left: 0.75px solid black;
    }

    a[target="_blank"]::after {
        content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAQElEQVR42qXKwQkAIAxDUUdxtO6/RBQkQZvSi8I/pL4BoGw/XPkh4XigPmsUgh0626AjRsgxHTkUThsG2T/sIlzdTsp52kSS1wAAAABJRU5ErkJggg==);
        margin: 0px 3px 0px 5px;
    }

    a {
        color: black;
        text-decoration: none;
    }

    a:hover {
        color: blue;
        text-decoration: underline;
    }

    .subtitle {
        font-weight: 300;
    }

    .blog-post {
        font-weight: 300;
    }

    .first {
        font-weight: 400;
    }

    .blog-link {
        font-weight: 400;
    }

    @media (prefers-color-scheme: dark) {
        a {
            color: white;
        }

        div {
            border-color: white;
        }

        a:hover {
            color: white;
        }

        a[target="_blank"]::after {
            content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAGFJREFUKFOlkMsRgEAIQ/M6sTS3Mu1MO4kuMzq4n5PcgDchAU3KtvOKbgA8gO1V0lb7AEnLAVQqPASTUgH2EGsVW+i58AFtL5IOSaHUhckeKwycyWtkmIb5B86e/ga533cB/51T+zztGjQAAAAASUVORK5CYII=);
            margin: 0px 3px 0px 5px;
        }
    }
</style>
