import { NextRequest, NextResponse } from "next/server";
import { VoiceObject } from "../page";
import { ElevenLabsClient, play } from "@elevenlabs/elevenlabs-js";

//Mock Voice Object
const voice: VoiceObject = {
	voice_id: "",
	name: "",
	category: "generated",
	available_for_tiers: [],
	description: "",
};

export async function GET() {
	// Fetch the generated voices from ElevenLabs API
	const elevenlabs = new ElevenLabsClient();

	const voicesList = await elevenlabs.voices.getAll({});
	//* Use this to get all the voices under your API key
	// console.log("voicesList", voicesList);

	// Return the voices we've generated
	const voices = [voice];
	const arrayOfGeneratedVoices = voices.filter(
		(element: VoiceObject) => element.category === "generated"
	);

	return NextResponse.json({ body: arrayOfGeneratedVoices });
}

export async function POST(req: NextRequest) {
	// Extract the text and voice id from the request body
	const request = await req.json();
	const theText = request.text;
	// const theVoiceId = request.voiceId;

	const elevenlabs = new ElevenLabsClient();
	const audio = await elevenlabs.textToSpeech.convert("whNpOfmE32DZzHNT05ik", {
		text: theText,
		modelId: "eleven_multilingual_v2",
		outputFormat: "mp3_44100_128",
	});

	// await play(audio);
	const finalResponse = new NextResponse(audio);
	return finalResponse;
}
