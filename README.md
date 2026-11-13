# MotionSites Web Design Skill for Codex

A project-scoped Codex skill for designing original web pages, landing pages, hero sections, and 3D-inspired experiences. It draws on the public [MotionSites Web Builder](https://github.com/Motionsites-AI/claude-skill) reference library while keeping that upstream project separate.

## Get started

```bash
git clone --recurse-submodules https://github.com/garyliu-hecheng/motionsites-web-design-skill.git
```

Open the cloned folder as a Codex project and ask Codex to use `$motionsites-web-design` for a web design task. The skill lives at [`.agents/skills/motionsites-web-design/SKILL.md`](.agents/skills/motionsites-web-design/SKILL.md). It can produce a design specification or implement a page when requested; this repository itself does not contain a finished website.

If the repository was cloned without submodules, run `git submodule update --init` in its root before using the linked MotionSites references.

## Licensing

The project-authored files in this repository are licensed under [MIT](LICENSE). The `motionsites-claude-skill-source` submodule has its [own license](motionsites-claude-skill-source/LICENSE): its example prompts and media are **not** covered by this repository's MIT license and must not be redistributed as a prompt or media collection. This is an independent Codex adaptation, not an official MotionSites release.
