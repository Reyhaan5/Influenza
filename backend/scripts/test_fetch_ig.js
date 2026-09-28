import fetch from "node-fetch";

async function test(username) {
  try {
    const res = await fetch(`https://imginn.com/${username}/`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      }
    });
    console.log(username, "Status:", res.status);
    const text = await res.text();
    const avatarMatch = text.match(/<img[^>]+src="([^">]+avatar[^">]+|[^">]+profile[^">]+|https:\/\/[^">]+)"/i);
    console.log("Avatar match:", avatarMatch ? avatarMatch[1] : "none");
    const metaImg = text.match(/<meta property="og:image" content="([^"]+)"/i);
    console.log("Meta img:", metaImg ? metaImg[1] : "none");
    const desc = text.match(/<meta property="og:description" content="([^"]+)"/i);
    console.log("Desc:", desc ? desc[1] : "none");
  } catch (err) {
    console.error(err.message);
  }
}

test("chrissutaria");
