import { useState } from "react";
import { Link } from "react-router-dom";
import MentionModal from "./MentionModal";

const MentionHover = ({ text }: { text: string }) => {
  const [modalMention, setModalMention] = useState(false);

  let firstIndexMentionTag = text.indexOf("[");
  let lastIndexMentionTag = text.indexOf("]");
  let mentionTagSubString = text.substring(
    firstIndexMentionTag + 1,
    lastIndexMentionTag
  );

  let firstIndexUserId = text.indexOf("(");
  let lastIndexUserId = text.indexOf(")");
  let userIdSubString = text.substring(firstIndexUserId + 1, lastIndexUserId);

  return (
    <span style={{ position: "relative" }}>
      {modalMention === true && <MentionModal userId={userIdSubString} />}
      <Link
        className="richText-a"
        onMouseOver={() => setModalMention(true)}
        onMouseLeave={() => setModalMention(false)}
        to={`/profile/${userIdSubString}`}
      >
        {mentionTagSubString} &nbsp;
      </Link>
    </span>
  );
};

export default MentionHover;
