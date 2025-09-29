import Link from "next/link";

export function TextToLinksParser(text: string) {
  const words = text.split(" ");

  return words.map((word, index) => {
    if (word.startsWith("@")) {
      const username = word.slice(1);
      return (
        <Link
          key={index}
          href={`/profile/${username}`}
          className="text-primary-400
          hover:underline"
        >
          {word}{" "}
        </Link>
      );
    }
    return word + " ";
  });
}
