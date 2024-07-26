"use client";

import React, {
  Dispatch,
  SetStateAction,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { EDITOR_TOOLS } from "./editor-tools";
//@ts-ignore
import Undo from "editorjs-undo";

type Props = {
  data?: OutputData;
  onChange(val: OutputData): void;
  holder: string;
  readonly: boolean;
  className?: string;
};

const EditorBlock = ({
  data,
  onChange,
  holder,
  readonly,
  className,
}: Props) => {
  const ref = useRef<EditorJS>();

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        tools: EDITOR_TOOLS,
        data: data,
        async onChange(api, event) {
          if (!readonly) {
            const data = await api.saver.save();
            onChange(data);
          }
        },
        onReady: () => {
          new Undo({ editor });
        },
        readOnly: readonly,
      });
      ref.current = editor;
    }

    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);

  return <div className={className} id={holder} />;
};

export default memo(EditorBlock);
