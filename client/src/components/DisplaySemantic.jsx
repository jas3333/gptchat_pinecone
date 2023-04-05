import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const DisplaySemantic = ({ item }) => {
    const formattedItem = item.replace(/\\n/g, '\n');

    const renderers = {
        text: (props) => {
            const { children, node } = props;
            const { position } = node;
            const sourceText =
                position && position.start && position.end
                    ? formattedItem.slice(position.start.offset, position.end.offset)
                    : children;
            return <span>{sourceText}</span>;
        },
    };
    return (
        <div>
            <div className='flex-box'>
                <div>
                    <ReactMarkdown
                        children={formattedItem}
                        renderers={renderers}
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');

                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        children={String(children).replace(/\n$/, '')}
                                        style={coldarkDark}
                                        language={match[1]}
                                        PreTag='div'
                                        {...props}
                                    />
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default DisplaySemantic;
