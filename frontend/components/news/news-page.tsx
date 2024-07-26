import { OutputData } from "@editorjs/editorjs";
import dynamic from "next/dynamic";

// editorjs should only be rendered on the client side.
// important that we use dynamic loading here
const EditorBlock = dynamic(() => import("./editor"), {
    ssr: false,
});

const NewsPage = (data: OutputData | undefined) => {
    // return (
    //     <EditorBlock data={data}  holder="editorjs-container" />
    // );
}

export default NewsPage;