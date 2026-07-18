import { describe, expect, it } from "vitest";
import { type SearchDoc, searchDocs } from "./search";

const doc = (
  title: string,
  text: string,
  kind: SearchDoc["kind"] = "post",
): SearchDoc => ({ kind, title, text, url: `/x/${title.toLowerCase()}` });

const docs: SearchDoc[] = [
  doc("Petping", "Java and Spring backend for a pet healthcare service."),
  doc("Spring notes", "A short post that mentions Java once."),
  doc("Design tokens", "Three token tiers and zero raw hex."),
  doc("오픈소스 여정", "OSSCA에서 Apache Zeppelin 팀의 리드 멘티로 활동했다."),
];

describe("searchDocs", () => {
  it("weights title matches above body matches", () => {
    const hits = searchDocs(docs, "spring");
    expect(hits.map((h) => h.title)).toEqual(["Spring notes", "Petping"]);
  });

  it("matches Korean terms by prefix within an eojeol", () => {
    const hits = searchDocs(docs, "오픈소스 멘티");
    expect(hits[0]?.title).toBe("오픈소스 여정");
  });

  it("returns a snippet around the first matched term", () => {
    const hits = searchDocs(docs, "healthcare");
    expect(hits[0]?.snippet).toContain("healthcare");
  });

  it("returns nothing for empty or unmatched queries", () => {
    expect(searchDocs(docs, "   ")).toEqual([]);
    expect(searchDocs(docs, "quantum")).toEqual([]);
  });

  it("caps results at the limit", () => {
    expect(searchDocs(docs, "java spring token", 1)).toHaveLength(1);
  });
});
