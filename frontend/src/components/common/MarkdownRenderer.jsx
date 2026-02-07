import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-6 mb-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-5 mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-4 mb-2" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-2" {...props} />,
          p: ({ node, ...props }) => <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 mb-3 text-sm text-slate-700 dark:text-slate-300" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 mb-3 text-sm text-slate-700 dark:text-slate-300" {...props} />,
          li: ({ node, ...props }) => <li className="ml-2" {...props} />,
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-slate-900 dark:text-slate-100" {...props} />
          ),
          em: ({ node, ...props }) => <em className="italic text-slate-700 dark:text-slate-300" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-indigo-500 dark:border-indigo-400 pl-4 py-2 my-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-r-lg text-slate-700 dark:text-slate-300 italic" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={dracula}
                language={match[1]}
                PreTag="div"
                className="rounded-xl my-3 text-sm"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ node, ...props }) => <pre className="bg-slate-900 dark:bg-slate-950 rounded-xl p-4 overflow-x-auto my-3" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
