"use client"

import React, { Dispatch, SetStateAction, memo, useEffect, useRef, useState } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { EDITOR_TOOLS } from "./editor_tools"
//@ts-ignore
import Undo from 'editorjs-undo';

type Props = {
    data?: OutputData;
    onChange(val: OutputData): void;
    holder: string;
};


const EditorBlock = ({ data, onChange, holder }: Props) => {
    const ref = useRef<EditorJS>();

    useEffect(() => {
        if (!ref.current) {
            const editor = new EditorJS({
                holder: holder,
                tools: EDITOR_TOOLS,
                data: data,
                async onChange(api, event) {
                    const data = await api.saver.save();
                    onChange(data);
                },
                onReady: () => {
                    new Undo({ editor });
                },
            });
            ref.current = editor;
        }

        return () => {
            if (ref.current && ref.current.destroy) {
                ref.current.destroy();
            }
        };
    }, []);


    return <div id={holder} />;
};

export default memo(EditorBlock);