/** The typed frontmatter block of a note, validated once at import time. */
export interface INoteFrontmatter {
  title: string
  slug: string
  /** ISO date string, `YYYY-MM-DD`. */
  date: string
  summary: string
  tags: string[]
  readingMinutes: number
  draft?: boolean
}

/** A note after parsing: frontmatter the app can trust, plus source and rendered body. */
export interface INote extends INoteFrontmatter {
  /** Raw markdown, frontmatter stripped. */
  body: string
  /** `body` rendered to HTML. */
  html: string
}

/** A frontmatter value before it has been narrowed onto `INoteFrontmatter`. */
export type NoteFrontmatterValue = string | string[] | number | boolean

/** The result of splitting a note file into frontmatter and markdown body. */
export interface IParsedFrontmatter {
  data: Record<string, NoteFrontmatterValue>
  body: string
}
