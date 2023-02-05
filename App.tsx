import { useState } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';

const addCommas = (num: number | string) => {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const data: Omit<CalcualtorButtonProps, "handlePress">[] = [
	{ text: "AC", type: "cnt" },
	{ text: "C", type: "cnt" },
	{ text: "%", type: "op" },
	{ text: "/", type: "op" },
	{ text: "7", type: "num" },
	{ text: "8", type: "num" },
	{ text: "9", type: "num" },
	{ text: "x", type: "op" },
	{ text: "4", type: "num" },
	{ text: "5", type: "num" },
	{ text: "6", type: "num" },
	{ text: "-", type: "op" },
	{ text: "1", type: "num" },
	{ text: "2", type: "num" },
	{ text: "3", type: "num" },
	{ text: "+", type: "op" },
	{ text: "ans", type: "cnt" },
	{ text: "0", type: "num" },
	{ text: ".", type: "num" },
	{ text: "=", type: "cnt" },
]

interface CalcualtorButtonProps {
	text: string;
	type: "num" | "op" | "cnt"
	handlePress: (text: string, type: "op" | "num" | 'cnt') => void;
}

const CalculatorButton: React.FC<CalcualtorButtonProps> = ({ text, type, handlePress }) => {

	return (
		<TouchableOpacity onPress={() => handlePress(text, type)}>
			<Text className={`font-bold hover:opacity-50 text-white text-center text-xl rounded-md p-5 ${type !== 'num' && 'text-orange-400'}`}>{text}</Text>
		</TouchableOpacity>
	)
}

export default function App() {
	const [history, setHistory] = useState<{ equation: string, result: number }[]>([]);
	const [input, setInput] = useState<string>("0");

	const handlePress = (text: string, type: string) => {
		// check type
		if (type === 'cnt') {
			// check if op is AC
			switch (text) {
				case "AC":
					clear()
					break
				case "C":
					setInput(input.slice(0, -1))
					break
				case "=":
					calculate()
					break
				case "ans":
					const lastCharOfInput = input[input.length - 1]
					if (lastCharOfInput === "+" || lastCharOfInput === "-" || lastCharOfInput === "x" || lastCharOfInput === "/")
						setInput(input + history[history.length - 1].result)
					else
						setInput(input + "x" + history[history.length - 1].result)
					break
			}
			return
		}
		// add number to board
		setInput(input === "0" ? text : input + text);
	}

	const calculate = () => {
		// calculate the result
		// solve the equasion stored in result
		// add result to history
		//regex to match 'x'
		const regex = /x/g;
		const sanitizedEquation = input.replace("--", "+").replace(regex, "*");
		const value = eval(sanitizedEquation).toString()
		if (isNaN(Number(value))) {
			setInput("Error")
			return
		}
		const historyEntry = { equation: input, result: parseInt(value) }
		setInput(value)
		setHistory([historyEntry, ...history]);
	}

	const clear = () => {
		if (input !== "0")
			setInput("0");
		else {
			setHistory([]);
		}
	}

	return (
		<View className="flex-1 items-center justify-start bg-primary-color py-5 px-1">
			<View className="self-end px-5 flex-1 gap-3">
				<View className="flex-1 self-end">
					<FlatList
						data={history}
						renderItem={({ item }) => <View className="my-1">
							<Text className="text-gray-500 text-2xl self-end">{addCommas(item.equation)}</Text>
							<Text className="text-gray-500 text-2xl self-end">= {addCommas(item.result)}</Text>
						</View>}
						keyExtractor={(_, index) => index.toString()}
						inverted
					/>
				</View>
				<Text className={`text-white text-4xl font-semibold self-end transition-all`}>{addCommas(input)}</Text>
			</View>
			<View className="w-full items-stretch">
				<FlatList
					numColumns={4}
					data={data}
					renderItem={({ item }) =>
						<View className="flex-1 ">
							<CalculatorButton text={item.text} type={item.type} handlePress={handlePress} />
						</View>}
					keyExtractor={(item) => item.text}
				>
				</FlatList>
			</View>
		</View>
	);
}
