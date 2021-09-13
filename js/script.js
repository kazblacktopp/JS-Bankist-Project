"use strict";

///////////////////////////////////////////////////////////////
// Fix for flexbox gap property missing in some Safari browsers

const checkFlexGap = () => {
  // Create a flex container with gap
  const flexEl = document.createElement("div");
  flexEl.style.display = "flex";
  flexEl.style.flexDirection = "column";
  flexEl.style.gap = "1px";

  // Append two child elements to flexEl container
  flexEl.appendChild(document.createElement("div"));
  flexEl.appendChild(document.createElement("div"));

  // Append flexEl container to DOM IOT read scrollHeight
  document.body.appendChild(flexEl);
  const isSupported = flexEl.scrollHeight === 1;
  flexEl.parentNode.removeChild(flexEl);

  return isSupported;
};

if (!checkFlexGap()) {
  document.body.classList.add("js-no-flexbox-gap");
  console.log("Flexbox gap is not supported");
  console.log(document.body);
}
///////////////////////////////////////////////////////////////
// Create Sticky Navigation Bar
