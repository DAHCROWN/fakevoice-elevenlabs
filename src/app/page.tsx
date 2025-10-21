"use client";
import { useEffect, useState } from "react";

export interface VoiceObject {
	available_for_tiers: string[];
	category: string;
	description: string;
	name: string;
	voice_id: string;
}

export default function Home() {
	const [theText, setTheText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [arrayOfVoices, setArrayOfVoices] = useState<
		Array<VoiceObject> | undefined
	>();
	const [theVoiceId, setTheVoiceId] = useState<string | undefined>();
	const [theAudio, setTheAudio] = useState<string | undefined>();

	async function getGeneratedVoices() {
		console.log("Getting generated Voices");
		const getResponse = await fetch("/api", {
			method: "GET",
		});

		if (getResponse.ok) {
			const tempGenVoices = await getResponse.json();
			setArrayOfVoices(tempGenVoices.body);
		}
	}

	useEffect(() => {
		getGeneratedVoices();
		console.log("Voices", arrayOfVoices);
	}, []);

	async function generateSpeech() {
		// Make sure we have some text and a selected voice to work with
		if (!theText || !theVoiceId) return;

		// Set the loading indicator
		setIsLoading(true);

		try {
			// Make the API call
			const response = await fetch("/api", {
				method: "POST",
				body: JSON.stringify({ text: theText, voiceId: theVoiceId }),
			});

			if (response.ok) {
				console.log("Speech generated successfully");

				// Get the response as a blob, and create an object url for the audio file
				const theResponse = await response.blob();
				setTheAudio(URL.createObjectURL(theResponse));
			} else {
				console.error("Failed to generate speech");
			}
		} catch (error) {
			console.error("Error occurred during API call:", error);
		}

		setIsLoading(false);
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-6 py-12 font-sans">
			<h1 className="text-6xl font-bold mb-6 tracking-tight">FakeVoice</h1>
			<p className="text-gray-400 text-lg text-center max-w-2xl mb-10">
				Convert your text into lifelike AI-generated speech using ElevenLabs.
			</p>

			<div className="flex flex-col items-center gap-6 w-full max-w-3xl">
				<div className="w-full text-center">
					<h2 className="text-2xl mb-4 font-semibold">Choose a Voice</h2>
					<div className="flex flex-wrap justify-center gap-4">
						{arrayOfVoices ? (
							arrayOfVoices.map((e: VoiceObject) => (
								<button
									key={e.voice_id}
									onClick={() => setTheVoiceId(e.voice_id)}
									className={`px-4 py-2 border rounded-md transition-colors duration-300 ${
										theVoiceId === e.voice_id
											? "bg-white text-black border-white"
											: "border-gray-500 hover:border-white hover:text-white text-gray-400"
									}`}
								>
									{e.name}
								</button>
							))
						) : (
							<span className="text-gray-500">Loading voices...</span>
						)}
					</div>
				</div>

				<textarea
					className="w-full h-40 p-3 bg-transparent border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-white resize-none"
					placeholder="Type something to convert..."
					onChange={(e) => setTheText(e.target.value)}
				/>

				<button
					onClick={generateSpeech}
					disabled={isLoading || !theText}
					className={`px-8 py-2 mt-2 rounded-md border text-lg font-medium transition-all duration-300 ${
						isLoading || !theText
							? "border-gray-600 text-gray-600 cursor-not-allowed"
							: "border-white text-white hover:bg-white hover:text-black"
					}`}
				>
					{isLoading ? "Generating..." : "Generate Speech"}
				</button>

				{theAudio && (
					<div className="w-full flex justify-center mt-10">
						<audio
							controls
							src={theAudio}
							className="w-full max-w-md border border-gray-700 rounded-md"
						>
							Your browser does not support the audio tag.
						</audio>
					</div>
				)}
			</div>
		</main>
	);
}
