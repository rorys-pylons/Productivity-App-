// The Night Broadcast — one station hiding on the band each week.
// Signal accrues from claimed quests and only ever clears, never decays.

export const QUESTS_TO_TUNE = 8;
export const LOCK_IN_REWARD = 40;

export type WeeklyBroadcast = {
  frequency: number;
  fragments: [string, string, string];
  transmission: string;
};

export const FRAGMENT_THRESHOLDS = [0.25, 0.55, 0.85] as const;

const BROADCASTS: WeeklyBroadcast[] = [
  {
    frequency: 1120,
    fragments: [
      "…county line's washed out again, take the long way if you're coming…",
      "…tower light's been out since June. if anyone's counting, that's two of us…",
      "…caller asked for a song for whoever's still up. this one goes out to the wire…",
    ],
    transmission:
      "You're tuned in. It's late, the valley's quiet, and by our count you did every last thing you said you would. Nobody saw it happen, but the grid felt it. Leave the porch light off — the stars are enough tonight.",
  },
  {
    frequency: 830,
    fragments: [
      "…substation crew found kudzu grown clear through the fence again. left it…",
      "…lost dog answering to Volt, last seen by the retention pond, friendly enough…",
      "…if your lights flickered around eight, that was us. or it wasn't. hard to say…",
    ],
    transmission:
      "This is 830 on your dial, broadcasting at the legal minimum. The week took its pound and you gave it anyway, one chore at a time. That's not nothing. Around here that's the whole economy.",
  },
  {
    frequency: 1460,
    fragments: [
      "…the fair's been gone thirty years but the wheel still turns when it storms…",
      "…somebody keeps feeding the meter outside the old exchange. thank you, whoever…",
      "…heat lightning tonight, no rain in it. just the sky remembering…",
    ],
    transmission:
      "Fourteen-sixty, the end of the band, where the static lives. You cleared the whole board this week. We watched the lights come on one by one down the line and figured it had to be you. It was you.",
  },
  {
    frequency: 640,
    fragments: [
      "…transformer on route 9 sings a note nobody can name. bring a tuner…",
      "…moths at the ballfield lights again, thick as weather. game's still on…",
      "…a listener writes: the hum in my house is my house. we agree…",
    ],
    transmission:
      "Six-forty AM, clear as a bell for once. Every task you finished this week put a little charge back on the line, and tonight the whole valley's running off it. Sleep with the window cracked. You've earned the quiet.",
  },
  {
    frequency: 990,
    fragments: [
      "…the co-op says pay what you can, when you can. the dark says nothing…",
      "…water tower's due a fresh coat. volunteers get their name in rust…",
      "…this next hour is uninterrupted tone, by request. you know who you are…",
    ],
    transmission:
      "Ninety-nine-zero, broadcasting from the far side of done. Eight for eight this week — the switchboard's never been so quiet. Whatever you were putting off, it's behind you now, humming in the wires with everything else that's finished.",
  },
  {
    frequency: 1300,
    fragments: [
      "…crows on the north line again, seventeen by our count, facing the plant…",
      "…the drive-in screen fell in March. movies continue on the fog bank…",
      "…somebody's porch radio has been on since '09. we play to it nightly…",
    ],
    transmission:
      "Thirteen hundred kilocycles of nothing but the truth: you did the work. All of it. The stars in your pocket came off this very wire, so spend them somewhere that makes noise. We'll hold the frequency till you're back.",
  },
  {
    frequency: 710,
    fragments: [
      "…mowers stop at dusk on account of the fireflies. county ordinance, unwritten…",
      "…the substation hums in B-flat tonight. yesterday it was A. we're watching it…",
      "…found: one work glove, still warm. inquire at the gate…",
    ],
    transmission:
      "Seven-ten. If you're hearing this, the week is over and you won. Not loudly — nobody wins loudly out here — but the kind of winning where the list is empty and the kettle's on. Stay tuned for nothing in particular.",
  },
  {
    frequency: 1240,
    fragments: [
      "…rain never made it past the ridge. the frogs sang anyway…",
      "…reminder: the swap meet moved to the old turbine hall. bring exact change…",
      "…if the wire sags lower this year, that's just the weight of the news…",
    ],
    transmission:
      "Twelve-forty, coming to you from the belly of the valley. Eight quests, eight little switches thrown, and now the whole board's dark in the good way. Rest isn't a reward, it's a right — but take the stars anyway.",
  },
  {
    frequency: 580,
    fragments: [
      "…the quarry pond gave back a bicycle today. nobody came to claim it…",
      "…kudzu took the billboard on route 9. it says something better now…",
      "…tonight's forecast: still. uncommonly, beautifully still…",
    ],
    transmission:
      "Five-eighty, low end of the band, where the ground hum lives. You cleared your week like brush off a line, and the current's moving easy tonight because of it. Leave your boots by the door. We'll take it from here.",
  },
  {
    frequency: 1370,
    fragments: [
      "…the night shift at the plant waves at the 11:40 freight. it waves back…",
      "…lost: the tune I came in humming. reward if found…",
      "…the moths have organized. details at the top of the hour…",
    ],
    transmission:
      "Thirteen-seventy. We counted your lights coming on down the row — kitchen, porch, kitchen again — and figured the week must be done. It is. You did it. The static will miss you till Monday.",
  },
  {
    frequency: 900,
    fragments: [
      "…canning jars sing on the shelf when the big transformer kicks in…",
      "…somebody repainted the water tower in the night. same color. thank you…",
      "…the creek's running backwards again. no cause for alarm, says the creek…",
    ],
    transmission:
      "Nine hundred even. Some weeks are a wall and some are a door, and you just walked through one carrying everything you said you'd carry. Set it down. Nine hundred stays on the air so you don't have to.",
  },
  {
    frequency: 1550,
    fragments: [
      "…coyotes moved through the easement about nine. polite, single file…",
      "…the fog bank is showing a western tonight. bring your own chair…",
      "…power's steady. hearts, we can't speak for…",
    ],
    transmission:
      "Fifteen-fifty, nearly off the edge of the dial. Anything that gets done out here gets done tired, and you did all of it anyway. That's the whole speech. Goodnight from the far end of the band.",
  },
  {
    frequency: 660,
    fragments: [
      "…somebody's been oiling the fairground gate. it doesn't creak now, it sighs…",
      "…eggs at the co-op, honor system. the jar's heavier than the carton…",
      "…tonight the wires are carrying more crickets than current…",
    ],
    transmission:
      "Six-sixty. The week came at you with both hands and you filed it anyway, one dull shining chore at a time. The meter out front of the exchange ticked over eight times tonight, and every tick was you.",
  },
  {
    frequency: 1050,
    fragments: [
      "…the school bell rings itself around midnight. we've stopped minding…",
      "…hay's in. whoever helped, the barn knows your name…",
      "…a low-pressure system of unclear intentions is parked over the ridge…",
    ],
    transmission:
      "Ten-fifty, dead center of the dial, dead center of the night. Eight for eight. If nobody told you today: the work you do when nobody's watching is the grid everybody stands on. Spend your stars slow.",
  },
  {
    frequency: 1490,
    fragments: [
      "…the payphone by the feed store rang twice today. both times for you, probably…",
      "…leaf smoke from three counties over. everybody's burning something old…",
      "…the plant's cooling tower made its own cloud again. it's a good one…",
    ],
    transmission:
      "Fourteen-ninety. There's a kind of tired that means you spent the week right, and we'd wager you're wearing it. The valley kept score, gently, the only way it knows: everything you finished stayed finished.",
  },
  {
    frequency: 760,
    fragments: [
      "…the laundromat's last dryer still takes tokens from the old arcade…",
      "…a truck idled at the crossroads for an hour and then just went home…",
      "…tonight's tone will be the long one. you'll know it when it holds you…",
    ],
    transmission:
      "Seven-sixty on the dial. You know that hum under everything — the one that never quite resolves? Tonight it did, for a minute, and it sounded like a week with nothing left owed on it. That was yours. Well done.",
  },
  {
    frequency: 1180,
    fragments: [
      "…deer in the switchyard again. they like the warm gravel, we like the company…",
      "…the co-op calendar is wrong about the moon and refuses to be corrected…",
      "…static tonight is local, homegrown, small-batch. drink it slow…",
    ],
    transmission:
      "Eleven-eighty. Every chore you crossed off this week went somewhere — down the line, through the ridge, out past the last pole where the wires just end and hang there hoping. Word came back. It arrived. All of it.",
  },
  {
    frequency: 620,
    fragments: [
      "…the diner keeps a plate warm for the lineman. the lineman retired in '98…",
      "…heat lightning practiced all evening and never once said its lines…",
      "…if you hear your name in the static, that's just the static being friendly…",
    ],
    transmission:
      "Six-twenty, low and slow. Out here we don't say productive, we say the fence got mended. Yours did. Eight posts, eight quests, and the pasture holds. Sleep like something that's been let out to graze.",
  },
  {
    frequency: 1330,
    fragments: [
      "…the exchange's last operator left her cardigan on the chair. it stays…",
      "…mile marker 9 is missing again. the road knows where it is…",
      "…tonight's broadcast is brought to you by the letter kilowatt…",
    ],
    transmission:
      "Thirteen-thirty. Somewhere between the first thing you didn't want to do and the last thing you did anyway, the week quietly surrendered. We have it here, signed. Your copy is the feeling in your shoulders letting go.",
  },
  {
    frequency: 970,
    fragments: [
      "…frost warning for the low fields. the low fields say bring it…",
      "…the vending machine at the plant gives double on Thursdays. tell no one…",
      "…someone strung lights on the dead oak. it's been very patient about it…",
    ],
    transmission:
      "Nine-seventy. A list is just a storm you break up into weather you can stand, and you stood all of it this week. Clear skies on the board tonight. The dead oak's wearing its lights for you, whether it admits it or not.",
  },
  {
    frequency: 1420,
    fragments: [
      "…the river took the canoe but left the paddle. negotiations continue…",
      "…third shift found a door in the plant nobody remembers. it's polite to knock…",
      "…tonight's silence sponsored by everything you already finished…",
    ],
    transmission:
      "Fourteen-twenty kilocycles. Every finished task is a light left on for the next one, and this week you lit the whole road home. We drove it earlier just to see. Prettiest stretch in the county.",
  },
  {
    frequency: 540,
    fragments: [
      "…first spot on the dial, last house on the line. we're both still here…",
      "…the gravel pit filled with rain and now it does the moon's paperwork…",
      "…a reminder that the hum you hear is also hearing you…",
    ],
    transmission:
      "Five-forty, the bottom of the band, the floor of the night. Eight quests down and nothing left but the sound of the house settling around a person who did what they said. That sound's the best thing we air all week.",
  },
  {
    frequency: 1600,
    fragments: [
      "…top of the dial, end of the wire, all the way up where the air thins…",
      "…the beacon on the cooling tower blinked twice for you tonight. we saw it…",
      "…past this frequency there's just weather, and past that, more weather…",
    ],
    transmission:
      "Sixteen hundred, the very top of the band. There's nothing above us but sky and nothing behind you but a week you emptied out fair and square. From all of us down at the plant: the grid held because you did.",
  },
];

export function getWeekStart(now = new Date()): Date {
  const d = new Date(now);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekKey(now = new Date()): string {
  // ISO week number
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export function broadcastForWeek(weekKey: string): WeeklyBroadcast {
  let hash = 0;
  for (let i = 0; i < weekKey.length; i++) {
    hash = (hash * 31 + weekKey.charCodeAt(i)) >>> 0;
  }
  return BROADCASTS[hash % BROADCASTS.length];
}
