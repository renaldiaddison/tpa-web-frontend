export const HashtagRichText1 = /#[a-z0-9A-Z]+/g;
export const HashtagRichText2 = /@\[#[a-z0-9A-Z]+/g;
export const MentionRichText = /@[a-z0-9A-Z]+/g;
export const URLRichText =
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._]{2,1000}\.\b([a-zA-Z0-9@:%_\+.#?&//=]*)/g;