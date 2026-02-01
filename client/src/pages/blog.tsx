import { useQuery } from "@tanstack/react-query";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  const { data: posts = [], isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
    queryFn: async () => {
      const response = await fetch("/api/blog");
      if (!response.ok) throw new Error("Failed to fetch blog posts");
      return response.json();
    },
  });

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="wm-hero-title text-3xl font-semibold" data-testid="text-blog-title">
          Blog / Updates
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground" data-testid="text-blog-subtitle">
          News, maker/guild features, event highlights, and updates.
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive" data-testid="error-blog">
          Failed to load blog posts. Please try again.
        </div>
      )}

      {isLoading && (
        <div className="text-center text-sm text-muted-foreground" data-testid="text-blog-loading">
          Loading blog posts...
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        {posts.map((p) => (
          <article key={p.id} className="rounded-2xl border bg-card p-6 shadow-sm" data-testid={`card-post-${p.postId}`}>
            <div className="text-sm font-semibold" data-testid={`text-post-title-${p.postId}`}>
              {p.title}
            </div>
            <div className="mt-1 text-xs text-muted-foreground" data-testid={`text-post-date-${p.postId}`}>
              {p.date}
            </div>
            <p className="mt-3 text-sm text-muted-foreground" data-testid={`text-post-excerpt-${p.postId}`}>
              {p.excerpt}
            </p>
            <button
              className="wm-focus-ring mt-4 rounded-full border bg-card px-4 py-2 text-sm font-semibold shadow-sm hover:bg-muted/60"
              data-testid={`button-post-read-${p.postId}`}
              onClick={() => alert("Placeholder: open post detail.")}
            >
              Read
            </button>
          </article>
        ))}
      </section>

      {!isLoading && posts.length === 0 && (
        <div className="rounded-xl border bg-muted/30 p-8 text-center" data-testid="text-no-posts">
          <div className="text-sm font-semibold">No blog posts yet</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Check back soon for news, updates, and community stories.
          </p>
        </div>
      )}
    </div>
  );
}
