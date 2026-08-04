export type Level = "L" | "M" | "H"

/**
 * The KBT sheet is split into two columns. The left column measures inner
 * capacities (more is better); the right column measures stress drivers
 * (more is worse). Scoring depends on this distinction.
 */
export type TraitGroup = "resource" | "driver"

export interface Trait {
  id: string
  label: string
  group: TraitGroup
  /** Plain-language framing shown directly under the trait name. */
  prompt: string
  /** Longer helper copy revealed by "Help me answer this". */
  help: string
  /** What each level means in the participant's own terms. */
  anchors: Record<Level, string>
  /** Explainer video. Leave undefined to render the "coming soon" slot. */
  videoUrl?: string
}

/** Left column of the sheet — inner capacities. Higher is healthier. */
export const RESOURCE_TRAITS: Trait[] = [
  {
    id: "balance-of-mind",
    label: "Balance of Mind",
    group: "resource",
    prompt: "How steady do you stay when things go wrong?",
    help: "Think about the last few times something genuinely disrupted your day — bad news, a conflict, a plan falling apart. Balance of mind is not about never reacting. It is about how quickly you return to level ground afterwards.",
    anchors: {
      L: "Small setbacks knock me off balance and it takes a long time to settle.",
      M: "I get shaken, but I can usually bring myself back within a day.",
      H: "I stay level through most disruptions and recover quickly.",
    },
  },
  {
    id: "concentration",
    label: "Concentration",
    group: "resource",
    prompt: "How well can you hold your attention on one thing?",
    help: "Consider ordinary tasks — reading, working, listening to someone talk. Concentration here means being able to stay with something without your mind sliding elsewhere.",
    anchors: {
      L: "My attention scatters within minutes, even on things I care about.",
      M: "I can focus in stretches, but I drift and have to pull myself back.",
      H: "I can stay with a task for long periods without losing the thread.",
    },
  },
  {
    id: "free-mind",
    label: "Free Mind",
    group: "resource",
    prompt: "How much mental space do you have that is not already occupied?",
    help: "A free mind is one that is not permanently booked by worry, planning, or unfinished business. Ask yourself whether there is room in your head for something new — or whether it is always full.",
    anchors: {
      L: "My mind is always occupied. There is never any quiet.",
      M: "I get pockets of clear space, usually when I am rested.",
      H: "My mind is mostly uncluttered and I can be genuinely present.",
    },
  },
  {
    id: "self-satisfaction",
    label: "Self Satisfaction",
    group: "resource",
    prompt: "How at peace are you with who you are and what you have?",
    help: "This is not about ambition. You can want more from life and still be satisfied with yourself. The question is whether there is a constant undercurrent of not-enough.",
    anchors: {
      L: "I rarely feel that I or my life measure up.",
      M: "It varies. Some days I am content, other days I fall short in my own eyes.",
      H: "I am broadly at peace with myself and where I am.",
    },
  },
  {
    id: "acceptance",
    label: "Acceptance",
    group: "resource",
    prompt: "How easily can you make peace with what cannot be changed?",
    help: "Acceptance is not approval or giving up. It is the ability to stop fighting a fact that is already settled — an outcome, a person's nature, something in the past.",
    anchors: {
      L: "I keep struggling against things long after they are decided.",
      M: "I get there eventually, but it costs me a lot of time and energy.",
      H: "I can recognise what is fixed and turn my attention elsewhere.",
    },
  },
  {
    id: "discrimination-power",
    label: "Discrimination Power",
    group: "resource",
    prompt: "How clearly can you tell what is good for you from what is not?",
    help: "This is the capacity to judge clearly — right from wrong, helpful from harmful, urgent from merely loud. It shows up most in the moments just before a decision.",
    anchors: {
      L: "I often cannot tell, or I see it clearly only in hindsight.",
      M: "I usually know, but I second-guess myself or get talked out of it.",
      H: "I can see clearly what serves me and act on that judgement.",
    },
  },
  {
    id: "will-power",
    label: "Will Power",
    group: "resource",
    prompt: "How reliably do you follow through on what you decide?",
    help: "Think about promises you made to yourself, not to others. Will power is the distance between deciding something and actually doing it.",
    anchors: {
      L: "I decide often and follow through rarely.",
      M: "I follow through when the stakes are high, but slip on smaller things.",
      H: "When I decide something, I generally carry it out.",
    },
  },
  {
    id: "persuasion",
    label: "Persuasion",
    group: "resource",
    prompt: "How well can you make yourself understood and heard?",
    help: "This covers your ability to bring others round to your point of view — at work, at home, in a disagreement. It is about being heard, not about winning.",
    anchors: {
      L: "I struggle to get my point across and often go along with others instead.",
      M: "I can make my case with people I am comfortable with.",
      H: "I can put my view across clearly and people generally engage with it.",
    },
  },
  {
    id: "purity-of-mind",
    label: "Purity of Mind",
    group: "resource",
    prompt: "How free are you of ill-will, envy, and hidden motives?",
    help: "This asks whether your intentions towards others are clean. Notice any recurring resentment, comparison, or private satisfaction at someone else's difficulty.",
    anchors: {
      L: "I carry a good deal of resentment, envy, or unspoken agenda.",
      M: "It surfaces from time to time, usually towards particular people.",
      H: "My intentions towards others are generally clean and open.",
    },
  },
  {
    id: "happiness",
    label: "Happiness",
    group: "resource",
    prompt: "What is your ordinary, everyday level of cheerfulness?",
    help: "Not peak moments or holidays — the baseline. If you think about an average Tuesday, what mood are you carrying around with you?",
    anchors: {
      L: "My baseline is low. Good moods are the exception.",
      M: "I am somewhere in the middle, lifted or lowered by circumstances.",
      H: "My ordinary state is cheerful and reasonably light.",
    },
  },
  {
    id: "life-fulfillment",
    label: "Life Fulfillment",
    group: "resource",
    prompt: "How much does your life feel like it is going somewhere that matters?",
    help: "This is the long view. Set aside today's problems and ask whether the overall direction of your life feels meaningful to you.",
    anchors: {
      L: "My life feels directionless or largely spent on things that do not matter.",
      M: "Parts of my life feel meaningful; other parts feel like filler.",
      H: "I have a clear sense that my life is going somewhere worthwhile.",
    },
  },
]

/** Right column of the sheet — stress drivers. Higher indicates more strain. */
export const DRIVER_TRAITS: Trait[] = [
  {
    id: "desires",
    label: "Desires",
    group: "driver",
    prompt: "How much of your day is driven by wanting things?",
    help: "Desire is not a fault in itself. The question is one of volume — how much of your mental energy goes into wanting something you do not currently have.",
    anchors: {
      L: "I want things, but it does not occupy much of my attention.",
      M: "Wanting takes up a noticeable share of my thinking.",
      H: "I am nearly always reaching for something. It rarely lets up.",
    },
  },
  {
    id: "fear",
    label: "Fear",
    group: "driver",
    prompt: "How much anxiety do you carry about what might happen?",
    help: "This includes named fears and the vague, background kind — health, money, people leaving, things going wrong. Consider how often it is present, not how rational it is.",
    anchors: {
      L: "I worry occasionally, but it passes.",
      M: "Fear is a regular presence and shapes some of my choices.",
      H: "Anxiety about the future is with me most of the time.",
    },
  },
  {
    id: "anger",
    label: "Anger",
    group: "driver",
    prompt: "How often and how strongly does irritation take hold?",
    help: "Count the quiet forms too — silent frustration, tightness, sarcasm. Anger that is never voiced still registers here.",
    anchors: {
      L: "I am rarely angry, and it fades quickly.",
      M: "I get irritated regularly, though I usually keep it contained.",
      H: "Anger comes fast and strong, or sits with me for a long time.",
    },
  },
  {
    id: "emotional-attachment",
    label: "Emotional Attachment",
    group: "driver",
    prompt: "How dependent is your wellbeing on particular people?",
    help: "Close relationships are healthy. This asks something narrower: how much your inner state rises and falls with how a specific person treats you or whether they are near.",
    anchors: {
      L: "I love people closely without my stability depending on them.",
      M: "My mood follows certain relationships more than I would like.",
      H: "My wellbeing is bound up almost entirely in particular people.",
    },
  },
  {
    id: "physical-attachment",
    label: "Physical Attachment",
    group: "driver",
    prompt: "How strongly are you attached to possessions, comfort, or appearance?",
    help: "Think about your relationship with belongings, routines of comfort, food, and how you look. The measure is distress at their loss or absence.",
    anchors: {
      L: "I enjoy these things but hold them lightly.",
      M: "Losing or going without some of them would genuinely unsettle me.",
      H: "My sense of security rests heavily on physical things and comfort.",
    },
  },
  {
    id: "deviation",
    label: "Deviation",
    group: "driver",
    prompt: "How far do you drift from what you intended to do or be?",
    help: "Deviation is the gap between the path you set for yourself — in habits, values, or discipline — and the one you actually walk day to day.",
    anchors: {
      L: "I stay close to the path I set for myself.",
      M: "I drift fairly often and have to correct course.",
      H: "There is a wide gap between who I intend to be and how I actually live.",
    },
  },
  {
    id: "volume-of-thoughts",
    label: "Volume of Thoughts",
    group: "driver",
    prompt: "How loud and crowded is your thinking?",
    help: "This is about quantity, not content. Overthinking, mental replay, running commentary, several trains of thought at once — all of it counts.",
    anchors: {
      L: "My thinking is fairly quiet and one thing at a time.",
      M: "My mind is busy, and it is hard to switch off in the evenings.",
      H: "There is constant mental noise. It is exhausting and hard to stop.",
    },
  },
  {
    id: "reminding-failure",
    label: "Reminding Failure",
    group: "driver",
    prompt: "How often do you replay your past failures?",
    help: "Everyone revisits mistakes. This asks how much of your present is spent back there — returning to the same episodes, rehearsing what you should have done.",
    anchors: {
      L: "I think about past mistakes rarely and without much sting.",
      M: "Certain failures come back to me regularly.",
      H: "I replay past failures constantly, and they still hurt.",
    },
  },
  {
    id: "ego",
    label: "Ego",
    group: "driver",
    prompt: "How much do you need to be right, recognised, or seen a certain way?",
    help: "Notice your reaction to being corrected, overlooked, or contradicted. The strength of that reaction is what is being measured.",
    anchors: {
      L: "Being wrong or unnoticed does not trouble me much.",
      M: "I notice a real sting when I am corrected or passed over.",
      H: "Much of my energy goes into being right and being seen as capable.",
    },
  },
  {
    id: "hurt",
    label: "Hurt",
    group: "driver",
    prompt: "How much wounding from others are you still carrying?",
    help: "This covers old injuries as well as recent ones — things said or done to you that you have not put down. Consider how present they still feel.",
    anchors: {
      L: "I carry very little. Old wounds have mostly healed.",
      M: "There are some injuries I have not fully put down.",
      H: "I carry a great deal of hurt, and it colours how I meet people.",
    },
  },
]

/** Full sheet in the order it is printed: left column, then right column. */
export const KBT_TRAITS: Trait[] = [...RESOURCE_TRAITS, ...DRIVER_TRAITS]

export const LEVEL_LABELS: Record<Level, string> = {
  L: "Low",
  M: "Medium",
  H: "High",
}
