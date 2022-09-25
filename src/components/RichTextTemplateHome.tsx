import React from "react";
import { Link } from "react-router-dom";
import MentionHover from "./MentionHover";
import {
  HashtagRichText1,
  URLRichText,
  MentionRichText,
  HashtagRichText2,
} from "../model/RichText";

const RichTextTemplateHome = ({ texts }: { texts: string[] }) => {
  return (
    <>
      {texts.map((text) => {
        if (text.match(HashtagRichText2)) {
          let firstIndexHastag = text.indexOf("[");
          let lastIndexHastag = text.indexOf("]");
          let hastagSubString = text.substring(
            firstIndexHastag + 1,
            lastIndexHastag
          );

          let hastagUrl = text.substring(firstIndexHastag + 2, lastIndexHastag);
          return (
            <Link className="richText-a" to={`/search/tags/${hastagUrl}`}>
              <p> {hastagSubString} &nbsp;</p>
            </Link>
          );
        } else if (text.match(HashtagRichText1)) {
          let hastagUrl = text.substring(1, text.length);
          return (
            <Link className="richText-a" to={`/search/tags/${hastagUrl}`}>
              <p>{text} &nbsp;</p>
            </Link>
          );
        } else if (text.match(URLRichText)) {
          return <a href={text}>{text}</a>;
        } else if (text.match(MentionRichText)) {
          return <MentionHover text={text} />;
        } else {
          return <span>{text} &nbsp;</span>;
        }
      })}
    </>
  );
};

export default RichTextTemplateHome;
