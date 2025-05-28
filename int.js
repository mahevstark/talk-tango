const { useState } = require("react");

// question 1
const apiUrls = ["firstapi", "secondapi", "thirdapi"];

let promise = getInParallel((apiUrls) => {
  apiUrls.map((url) => Promise.resolve("api response from" + url));
});

if (promise) {
  promise
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
}

//question 2

function charachterAttributess({ totalPoints }) {
  const [chrAtrb, setChrAtrb] = useState({
    strenght: 0,
    speed: 0,
  });

  // totalpoints =15
  const [charPoints, setcharPoints] = useState(0);

  const handleAttributeChange = (event, name) => {
    const value = event.target.value;

    const attrb = name;
    if (name === "speed") {
      setChrAtrb((prevState) => ({
        strenght: value - prevState.strenght,
        speed: value,
      }));
    } else if (name === "strenght") {
      setChrAtrb((prevState) => ({
        ...prevState,
        strenght: strenght,
      }));

      const newpoints = value + charPoints;
      setcharPoints(newpoints);
    }
  };

  return (
    <>
      <p>Charachter stats : ${charPoints}</p>
      <input
        type="range"
        id="strength"
        min="0"
        max={totalPoints}
        value={strength}
        step="1"
        onChange={(event) => handleAttributeChange(event, "strength")}
      />
      <input
        type="range"
        id="strength"
        min="0"
        max={totalPoints}
        value={strength}
        step="1"
        onChange={(event) => handleAttributeChange(event, "strength")}
      />
    </>
  );
}

// question 3
// option 1 but multiple employees have different data
