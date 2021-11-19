import { useLinkBuilder } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	ImageBackground,
	KeyboardAvoidingView,
	TouchableOpacity,
	KeyboardAvoidingViewBase,
	TextInput,
} from "react-native";
import { supabase } from "../supabaseClient";
import uuid from "react-native-uuid";
import Player from "../entities/Player";

const NewGame = () => {
	console.log("refresh");

	const [nameInput, setNameInput] = useState("");
	const [pointsInput, setPointsInput] = useState("");
	const [players, setPlayers] = useState([null, null, null, null]);

	const addPlayer = () => {
		// Ici d'éventuels checks supplémentaires pour les inputs peuvent être éffectués
		// Pour le moment ça cehck si un des deux inputs est vide
		if (nameInput !== "" && pointsInput !== "") {
			// Check si il n'y a pas déjà 4 joueurs dans l'array et trouve le slot libre
			const freeSlot = players.findIndex((item) => item === null);
			if (freeSlot !== -1) {
				if (
					// check si le nom ne se trouve pas déjà dans l'array
					!players.find((item) => {
						if (item !== null) {
							return item.name === nameInput;
						}
					})
				) {
					// Ajoute le joueur dans l'array à la place libre
					const newArray = [...players];
					newArray[freeSlot] = new Player(
						freeSlot + 1,
						nameInput,
						pointsInput,
						null
					);
					setPlayers(newArray);
				}
			}
		}
	};

	const removePlayer = (slot) => {
		const newArray = [...players];
		newArray[slot] = null;
		// Rebuild l'array pour que les nulls soient remplis (Si le joueur 3 est supprimé de la liste, le joueur 4 prendra sa place dans l'array par exemple)
		for (let i = 1; i < 4; i++) {
			const player = newArray[i];
			if (newArray[i - 1] === null && player !== null) {
				player.slot = i;
				newArray[i - 1] = player;
				newArray[i] = null;
			}
		}
		setPlayers(newArray);
	};

	const handleSaveGame = async () => {
		// Chargement durant le temps de la sauvegarde (désactiver le bouton par exemple)

		const enoughPlayers = players.findIndex((item) => item === null);
		// enoughPlayers sera égal à -1 si il y a 4 joueurs ou au moins égale a 2 si il y a 2 joueurs
		if (enoughPlayers === -1 || enoughPlayers >= 2) {
			// au moins 2 joueurs
			players.forEach((player) => {
				console.log("handleSaveGame -> Foreach sur le joueur :", player);
				if (player !== null) {
					// Il faut check si ce slot n'est pas null

					// const { data: profiles, error } = await supabase
					// 	.from("profiles")
					// 	.select("username")
					// 	.eq("username", player)
					// 	.single();

					// let tempRes = profiles !== null ? true : false;
					// if (tempRes) {
					// 	console.log("Profil existant : ", player);
					// } else {
					// 	const uuidconst = uuid.v4();
					// 	const { data, error } = await supabase.from("profiles").insert([
					// 		{
					// 			id: uuidconst,
					// 			username: player,
					// 			invited: true,
					// 		},
					// 	]);
					// 	console.log("Joueur ajouté: ", player);
					// }

					// const { data: profiles, error } = await supabase
					// 	.from("profiles")
					// 	.select("id")
					// 	.eq("username", player);

					// setResultatBDD([...res, profiles[0].id]);

					console.log(
						"Ici ajout du profile à l'objet player quand il est trouvé ou créé ?"
					);
					// Pour l'instant j'ajoute de la donnée bidon à remplacer avec le résultat de la requête
					player.profile = {
						id: uuid.v4(),
						username: player.name,
						invited: true,
					};
				}
			});

			addGame();
		} else {
			// Il faudra ajouter un message qui s'affiche eventuellement au dessus du bouton
			console.log("Au moins deux joueurs requis pour la sauvegarde");
		}
	};

	const addGame = () => {
		// Récupère les joueurs dans l'array (sans les nulls si il y en a)
		const validPlayers = [];
		players.map((player) => {
			if (player !== null) validPlayers.push(player);
		});

		console.log(
			"Sauvegarde de la game supabase, array de joueurs :",
			validPlayers
		);
		// Sauvegarde de la game supabase
	};

	return (
		<ImageBackground
			source={require("../assets/lapinGold.jpg")}
			style={styles.imgBackground}
			resizeMode="cover"
			imageStyle={{ opacity: 0.24 }}
			blurRadius={1}
		>
			<View style={styles.container}>
				<ScrollView
					contentInsetAdjustmentBehavior="automatic"
					contentContainerStyle={styles.contentContainer}
				>
					<Text style={styles.titreApp}>Nouvelle Partie</Text>
					<View style={styles.blocBody}>
						<View style={styles.playerBloc}>
							<TextInput
								placeholder="Entrez le pseudo"
								style={styles.input}
								onChangeText={(value) => setNameInput(value)}
							/>
							<TextInput
								placeholder="Entrez le score"
								keyboardType="numeric"
								style={styles.input}
								onChangeText={(value) => setPointsInput(value)}
							/>
						</View>
						<TouchableOpacity
							style={styles.AddPlayerButton}
							onPress={() => addPlayer()}
						>
							<Text style={styles.addPlayer}>+</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.playerListBloc}>
						<Text>Joueurs de la partie: </Text>
						{players.map((player) => {
							if (player !== null) {
								return (
									<View key={player.slot} style={styles.playerListSingle}>
										<Text>{"Joueur " + player.slot}</Text>
										<Text>{"Nom: " + player.name}</Text>
										<Text>{"Points: " + player.points}</Text>
										<TouchableOpacity
											onPress={() => removePlayer(player.slot - 1)}
										>
											<Text style={styles.cross}>X</Text>
										</TouchableOpacity>
									</View>
								);
							}
						})}
					</View>

					<View style={styles.buttonContainer}>
						<TouchableOpacity style={styles.button} onPress={handleSaveGame}>
							<Text style={styles.buttonText}>Lancer la partie</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
		flex: 1,
	},
	imgBackground: {
		width: "100%",
		height: "100%",
		flex: 1,
	},
	titreApp: {
		fontSize: 26,
		height: 30,
		marginBottom: 40,
		fontWeight: "bold",
	},
	cross: {
		// marginTop: 20,
		textAlign: "center",
		color: "red",
		fontSize: 30,
	},
	contentContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	blocBody: {
		width: "100%",
		height: "40%",
		flexWrap: "wrap",
		marginBottom: 100,
	},
	playerBloc: {
		margin: 10,
		marginLeft: 20,
		width: 160,
		height: 160,
		borderWidth: 1,
		borderColor: "black",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
		backgroundColor: "#CEDEE0",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.27,
		shadowRadius: 4.65,
		elevation: 6,
	},
	buttonContainer: {
		width: "60%",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 80,
	},
	button: {
		width: "100%",
		backgroundColor: "#03768A",
		padding: 15,
		borderRadius: 10,
		alignItems: "center",
	},
	buttonText: {
		color: "#FFF",
	},
	input: {
		width: "80%",
		height: 30,
		marginTop: 5,
		backgroundColor: "white",
		padding: 5,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: "black",
	},
	icons: {
		fontSize: 100,
		color: "blue",
	},
	addPlayer: {
		color: "#FFF",
		fontSize: 50,
	},
	AddPlayerButton: {
		width: "50%",
		backgroundColor: "#03768A",
		padding: 15,
		borderRadius: 10,
		alignItems: "center",
	},

	playerListBloc: {
		width: 250,
		padding: 6,
		margin: 6,
		borderWidth: 1,
		borderColor: "black",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
		backgroundColor: "#CEDEE0",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.27,
		shadowRadius: 4.65,
		elevation: 6,
	},
	playerListSingle: {
		width: "100%",
		padding: 5,
		margin: 5,
		borderWidth: 1,
		textAlign: "left",
		flexDirection: "column",
		justifyContent: "center",
	},
});

export default NewGame;
