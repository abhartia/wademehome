import React from "react";
import { useChatMessage } from "@llamaindex/chat-ui";
import {
  UIEventsAnnotations as UIEventsAnnotations,
  UIEventsTypesEnum,
} from "../UIEventsTypes";

type AnnotationRenderProps<T extends UIEventsAnnotations> = {
  data: T["data"];
};

type Props<T extends UIEventsAnnotations,> = {
  type: UIEventsTypesEnum;
  children: (props: AnnotationRenderProps<T>) => React.ReactNode;
};

export const AnnotationsWidgetHOC = <T extends UIEventsAnnotations>({ type, children }: Props<T>) => {
  const { message } = useChatMessage();
  const typedMessage = message as { annotations?: UIEventsAnnotations[] };
  const annotations = typedMessage.annotations || [];

  const filteredUIEventAnnotation = annotations.filter(
    (annotation) => annotation?.type.includes(type)
  ) as UIEventsAnnotations[];

  if (!filteredUIEventAnnotation)
    return null;

  return <div className="flex flex-col gap-2">{
    filteredUIEventAnnotation.map((annotation, index) => {
      return (
        <div key={index}>
          {children({ data: annotation.data })}
        </div>
      );
    })
  }</div>;
};

export default AnnotationsWidgetHOC;
