import * as React from "react";
import "./App.css";

const Identicon = seed => {
  console.log("seed", seed);
  const [hash, setHash] = React.useState([]);

  React.useEffect(() => {
    sha256("abhsbhbahsb").then(e => {
      console.log("eee", e);
      setHash(e);
    });
  }, []);

  const size = 100;
  let content = null;
  let fill = "";
  function getRandomInt() {
    const min = 3;
    const max = 9;
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }
  const generate = (n, offset, r, cx, cy) =>
    Array.from(Array(n))
      .map(
        (e, index) =>
          `${r * Math.cos((index * 2 * Math.PI) / n + offset) + cx},${r *
            Math.sin((index * 2 * Math.PI) / n + offset) -
            cy}`
      )
      .join(" ");

  const getColor = (i, hash) => hash.slice(i, i + 5).reduce((a, b) => a + b, 0) % 255;

  const polygonAllign = (n, c, s = false) => {
    const sp = s ? Math.PI : 0;
    if (c) {
      return n % 2 === 0 ? Math.PI / n + sp : Math.PI / 2 + sp;
    } else {
      return n % 2 === 0 ? 0 + sp : -Math.PI / 2 + sp;
    }
  };
  if (hash) {
    console.log("hashaquiii", hash);
    content = [];
    console.log(" getRandomInt()", getRandomInt());

    let color = `rgb(${getColor(0, hash)}, ${getColor(5, hash)}, ${getColor(10, hash)})`;
    fill = `rgb(${
      Math.abs(getColor(15, hash) - getColor(0, hash)) < 30
        ? (getColor(15, hash) + 75) % 255
        : getColor(15, hash)
    }, ${
      Math.abs(getColor(20, hash) - getColor(5, hash)) < 30
        ? (getColor(20, hash) + 75) % 255
        : getColor(20, hash)
    }, ${
      Math.abs(getColor(25, hash) - getColor(10, hash)) < 30
        ? (getColor(25, hash) + 75) % 255
        : getColor(25, hash)
    })`;
    // console.log('color', color)
    // console.log('fill', fill)
    content.push(
      (hash[30] % 7) + 3 < 9 ? (
        <polygon
          points={generate(
            (hash[30] % 7) + 3,
            polygonAllign((hash[30] % 7) + 3, hash[30] < 125),
            (size * 2) / 10,
            0,
            0
          )}
          fill="none"
          stroke={color}
          stroke-linejoin="round"
          strokeWidth={2}
        />
      ) : (
        <circle
          cx="0"
          cy="0"
          r={(size * 2) / 10}
          fill="none"
          stroke-linejoin="round"
          stroke={color}
          strokeWidth={2}
        />
      )
    );
    //impar  +-Math.PI/4
    // par Math.PI/n
    console.log("polial", polygonAllign(3, hash[31] < 125));

    content.push(
      (hash[31] % 7) + 3 < 7 ? (
        <polygon
          points={generate(
            (hash[31] % 7) + 3,
            polygonAllign((hash[31] % 7) + 3, hash[31] < 125),
            (size * 3) / 10,
            0,
            0
          )}
          fill="none"
          stroke-linejoin="round"
          stroke={color}
          strokeWidth={2}
        />
      ) : (
        <circle
          cx="0"
          cy="0"
          r={(size * 3) / 10}
          fill="none"
          stroke-linejoin="round"
          stroke={color}
          strokeWidth={2}
        />
      )
    );

    content.push(
      (hash[0] % 7) + 3 < 7 ? (
        <polygon
          points={generate(
            (hash[0] % 7) + 3,
            polygonAllign((hash[0] % 7) + 3, hash[0] < 125),
            (size * 1) / 2,
            50,
            0
          )}
          fill="none"
          stroke-linejoin="round"
          stroke={color}
          strokeWidth={2}
        />
      ) : (
        <circle
          cx="50"
          cy="0"
          r={(size * 1) / 2}
          fill="none"
          stroke-linejoin="round"
          stroke={color}
          strokeWidth={2}
        />
      )
    );

    content.push(
      (hash[0] % 7) + 3 < 7 ? (
        <polygon
          points={generate(
            (hash[0] % 7) + 3,
            polygonAllign((hash[0] % 7) + 3, hash[0] < 125, true),
            (size * 1) / 2,
            0,
            50
          )}
          fill="none"
          stroke-linejoin="round"
          stroke={color}
          strokeWidth={2}
        />
      ) : (
        <circle
          cx="0"
          cy="-50"
          r={(size * 1) / 2}
          fill="none"
          stroke-linejoin="round"
          stroke={color}
          strokeWidth={2}
        />
      )
    );

    content.push(
      (hash[0] % 7) + 3 < 7 ? (
        <polygon
          points={generate(
            (hash[0] % 7) + 3,
            polygonAllign((hash[0] % 7) + 3, hash[0] < 125),
            (size * 1) / 2,
            0,
            -50
          )}
          fill="none"
          stroke-linejoin="round"
          stroke={color}
          strokeWidth={2}
        />
      ) : (
        <circle
          cx="0"
          cy="50"
          r={(size * 1) / 2}
          fill="none"
          stroke-linejoin="round"
          stroke={color}
          strokeWidth={2}
        />
      )
    );

    content.push(
      (hash[0] % 7) + 3 < 7 ? (
        <polygon
          points={generate(
            (hash[0] % 7) + 3,
            polygonAllign((hash[0] % 7) + 3, hash[0] < 125),
            (size * 1) / 2,
            -50,
            0
          )}
          fill="none"
          stroke-linejoin="round"
          stroke={color}
          strokeWidth={2}
        />
      ) : (
        <circle
          cx="-50"
          cy="0"
          r={(size * 1) / 2}
          fill="none"
          stroke-linejoin="round"
          stroke={color}
          strokeWidth={2}
        />
      )
    );

    content.push(
      (hash[1] % 7) + 3 < 7 ? (
        <polygon
          points={generate(
            (hash[1] % 7) + 3,
            polygonAllign((hash[1] % 7) + 3, hash[1] < 125),
            (size * 1) / 10,
            -40,
            0
          )}
          fill="none"
          stroke-linejoin="round"
          stroke={color}
          strokeWidth={2}
        />
      ) : (
        <circle
          cx="-40"
          cy="0"
          r={(size * 1) / 10}
          fill="none"
          stroke-linejoin="round"
          stroke={color}
          strokeWidth={2}
        />
      )
    );

    content.push(
      (hash[1] % 7) + 3 < 7 ? (
        <polygon
          points={generate(
            (hash[1] % 7) + 3,
            polygonAllign((hash[1] % 7) + 3, hash[1] < 125),
            (size * 1) / 10,
            40,
            0
          )}
          fill="none"
          stroke-linejoin="round"
          stroke={color}
          strokeWidth={2}
        />
      ) : (
        <circle
          cx="40"
          cy="0"
          r={(size * 1) / 10}
          fill="none"
          stroke-linejoin="round"
          stroke={color}
          strokeWidth={2}
        />
      )
    );

    content.push(
      (hash[1] % 7) + 3 < 7 ? (
        <polygon
          points={generate(
            (hash[1] % 7) + 3,
            polygonAllign((hash[1] % 7) + 3, hash[1] < 125, true),
            (size * 1) / 10,
            0,
            40
          )}
          fill="none"
          stroke-linejoin="round"
          stroke={color}
          strokeWidth={2}
        />
      ) : (
        <circle
          cx="0"
          cy="-40"
          r={(size * 1) / 10}
          fill="none"
          stroke-linejoin="round"
          stroke={color}
          strokeWidth={2}
        />
      )
    );
    content.push(
      (hash[1] % 7) + 3 < 7 ? (
        <polygon
          points={generate(
            (hash[1] % 7) + 3,
            polygonAllign((hash[1] % 7) + 3, hash[1] < 125),
            (size * 1) / 10,
            0,
            -40
          )}
          fill="none"
          stroke-linejoin="round"
          stroke={color}
          strokeWidth={2}
        />
      ) : (
        <circle
          cx="0"
          cy="40"
          r={(size * 1) / 10}
          fill="none"
          stroke-linejoin="round"
          stroke={color}
          strokeWidth={2}
        />
      )
    );
  }

  // scale(2, 1)

  return (
    <svg
      className="identicon"
      id={hash}
      viewBox={`0 0 ${size} ${size}`}
      stroke="#111"
      stroke-width="1"
      style={{ backgroundColor: fill, transform: "scale(0.3)" }}
    >
      <g transform="translate(50,50)">{content}</g>
    </svg>
  );
};

export default Identicon;

async function sha256(message) {
  const bytes = new TextEncoder("utf-8").encode(message);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash));
}
