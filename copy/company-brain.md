# Company brain: Open Room

Every claim on the site should trace to something here. Mined from the app README at `../open-room/README.md` on 2026-09-03. Sections marked TODO have no input yet; do not invent content for them.

## Audience

- Who: a developer who already pays for Claude Code and runs it in a terminal, and wants to run more than one thing at once without watching each one.
- The moment: they have two or three tasks that could run in parallel, and the only way is more terminal windows they have to keep checking.
- Pains, in their words: TODO. No customer quotes yet. Working assumptions from the README's framing: watching a terminal scroll instead of doing other work; juggling windows to run several agents; forgetting what an agent was doing after a restart.
- Objections: "does it need my API key" (no, it uses the existing Claude Code login); "what does it send where" (nothing leaves the machine except Claude Code's own traffic to Anthropic); "is an open microphone safe" (voice input ships off, wake words are a second opt-in); "will it eat my quota" (yes, N agents means N sessions on one account, and the app shows rate limits as a banner).
- Tried instead: multiple terminals, tmux panes, git worktrees, one agent at a time. TODO confirm.

## Offer

- What it is: a desktop app for running several named Claude Code agents at once and talking to them, by voice or by typing, while you get on with something else.
- Price: free. MIT licence. Uses the user's own Claude Code subscription; every turn bills that.
- Mechanism: each agent is a real Claude Code session driven through the Agent SDK, in its own workspace folder, with a persistent AGENT.md role file. Speech-to-text and text-to-speech run locally.
- Features to benefits:
  - Named agents with a colour, voice, model, tools and folder -> you know who you are talking to and who did what -> several agents feel like colleagues, not tabs.
  - Wake word "hey <name>", push-to-talk hotkey, or typing -> you can address one agent from anywhere on the desktop -> you do not have to switch to its window.
  - Custom wake words with no training, any name works instantly -> naming is free and immediate.
  - Works in the background, reports through a native notification or out loud in its own voice -> you can leave and it finds you when done or stuck.
  - A question is never dropped from the speech queue -> you will not miss an agent that is blocked.
  - Conversations persist across restarts, plus a WORKLOG.md per agent -> an agent you spoke to yesterday remembers what you were doing.
  - Permissions per tool, three states (ask, always allow, never allow), no bypass mode in the UI -> agents do not do anything you did not agree to, including from voice.
  - No API keys, no telemetry, no server other than Anthropic's, local speech in and out -> nothing leaves your machine.
  - Session controls from the pane (model, effort, permission mode), quota banner, context meter -> you see cost and limits as they happen.
- Guarantee, trial, cancellation: not applicable. Free.

## Voice

Derived from the README. It is plain, specific and unhurried, with measured numbers where they exist and known gaps stated rather than hidden.

- Plain over clever. On: "It finds you when it is done or stuck." Off: "Supercharge your agentic workflow."
- Concrete over abstract. On: "Say hey Atlas, run the tests." Off: "Seamless natural-language orchestration."
- Honest about limits. On: "Windows first. macOS is configured but not yet run on a Mac." Off: "Works everywhere."
- Uses: agent, name, room, talk, by voice or by typing, get on with something else, finds you, your own login, stays on your machine.
- Avoids: orchestrate, seamless, supercharge, AI-powered, revolutionary, copilot, assistant (replace with agent), workflow (replace with the actual task).
- Sentences: short, second person, contractions fine, light humour fine, no exclamation marks.

## Proof

- Testimonials: TODO. None yet.
- Metrics: TODO. None public. GitHub stars could be shown if real: [CONFIRM: current star count on github.com/TheLinc/open-room].
- Press, logos, awards: none.
- Case studies: none.

## Positioning

- For developers who already use Claude Code and want to run several tasks without babysitting a terminal, Open Room is the desktop app that gives each agent a name and a voice, so you can ask for something and get on with your own work.
- Real alternative: more terminal windows, checked by hand.
- Why we win, in the user's words: "I say the name and the job, and it comes and tells me when it is done."

## Pages and traffic

- Site: one page at https://openroom.dev. Primary action: [CONFIRM: waitlist email signup for the coming-soon page, or a download button, since installers already exist on the releases page].
- Traffic: GitHub README link, developer social posts, word of mouth. Visitors know Claude Code. Awareness stage: solution-aware.
- Linkable pages: the GitHub repo, the releases page (https://github.com/TheLinc/open-room/releases/latest). Nothing else exists yet.
