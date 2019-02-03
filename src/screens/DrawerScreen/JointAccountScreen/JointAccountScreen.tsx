import React from "react";
import {
	Image,
	Platform,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
	FlatList,
	StatusBar,
	Alert,
	ImageBackground,
	RefreshControl,
	Linking
} from "react-native";
import {
	Container,
	Header,
	Title,
	Content,
	Button,
	Left,
	Right,
	Body,
	Text,
	List,
	ListItem,
	Thumbnail,
	Footer
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import {
	MenuProvider,
	Menu,
	MenuOptions,
	MenuOption,
	MenuTrigger
} from "react-native-popup-menu";
import DropdownAlert from "react-native-dropdownalert";

//TODO: Custome Pages
import { colors, images, localDB } from "../../../app/constants/Constants";
var dbOpration = require("../../../app/manager/database/DBOpration");
var utils = require("../../../app/constants/Utils");
import renderIf from "../../../app/constants/validation/renderIf";
import { AsyncStorage } from "react-native"

let isNetwork;
//import styles from './Styles';

import { DotIndicator } from "react-native-indicators";

//TODO: Wallets
import WalletService from "../../../bitcoin/services/WalletService";

export default class JointAccountScreen extends React.Component {
	constructor(props) {
		super(props);
		StatusBar.setBackgroundColor(colors.appColor, true);
		this.state = {
			address: "test address",
			refreshing: false,
			isLoading: false,
			isNoTranstion: false
		};
		isNetwork = utils.getNetwork();
	}

	readDataAndSetStates = async () => {

		try {
			const value = await AsyncStorage.getItem("Joint");
			if (value !== null) {
				let Joint = JSON.parse(value)
				this.setState({
					address: Joint.Add
				})
				console.log("address", this.state.address)
			}
		} catch (error) {
			// Error retrieving data
		}
	}

	componentWillMount() {
		this.readDataAndSetStates()
	}

	componentDidMount() { // B
		if (Platform.OS === 'android') {
			Linking.getInitialURL().then(url => {
				this.navigate(url);
			});
		} else {
			Linking.addEventListener('url', this.handleOpenURL);
		}
	}

	// componentWillUnmount() { // C
	// 	Linking.removeEventListener('url', this.handleOpenURL);
	// }
	// handleOpenURL = (event) => { // D
	// 	this.navigate(event.url);
	// }
	// navigate = (url) => { // E
	// 	const { navigate } = this.props.navigation;
	// 	const route = url.replace(/.*?:\/\//g, '');
	// 	const id = route.match(/\/([^\/]+)\/?$/)[1];
	// 	const routeName = route.split('/')[0];

	// 	if (routeName === 'joint') {
	// 		navigate('TransactionConfirmationScreen', { id })
	// 	};
	// }

	render() {
		return (
			<Container style={styles.container}>
				<Content
					contentContainerStyle={styles.container}
				// refreshControl={
				// 	<RefreshControl
				// 		refreshing={this.state.refreshing}
				// 		onRefresh={this.refresh.bind(this)}
				// 	/>
				// }
				>
					<ImageBackground
						source={images.accounts["Secure"]}
						style={styles["Secure"]}
						borderRadius={10}
						imageStyle={{
							resizeMode: "cover" // works only here!
						}}
					>
						<View style={styles.viewBackBtn}>
							<Left>
								<Button
									transparent
									onPress={() => this.props.navigation.goBack()}
								>
									<Icon name="chevron-left" size={25} color="#ffffff" />
								</Button>
							</Left>
							<Right>
								<MenuProvider>
									<Menu style={{ marginTop: 10, color: "#ffffff" }}>
										<MenuTrigger
											customStyles={{
												triggerText: { fontSize: 18, color: "#fff" }
											}}
											text="options"
										/>
										<MenuOptions customStyles={{ optionText: styles.text }}>
											<MenuOption onSelect={() => this.props.navigation.push("AcknowledgeJointAccountScreen")} text="Import" />
											<MenuOption onSelect={() => alert(`Delete`)}>
												<Text style={{ color: "red" }}>Delete</Text>
											</MenuOption>
										</MenuOptions>
									</Menu>
								</MenuProvider>
							</Right>
						</View>
						<View style={styles.viewBalInfo}>
							<Text style={[styles.txtTile, styles.txtAccountType]}>
								Joint
							</Text>
							<View style={{ flexDirection: "row" }}>
								<Text style={[styles.txtTile, styles.txtBalInfo]}>
									0
								</Text>
								<Text style={[styles.txtTile, styles.txtBalInfo]}>
									BTC
								</Text>
							</View>
						</View>
					</ImageBackground>
					<View style={styles.viewMainRecentTran}>
						<View style={styles.viewTitleRecentTrans}>
							<Text style={styles.txtRecentTran}>Recent Transactions</Text>
						</View>
						<View style={styles.recentTransListView}>
						</View>
					</View>
					<View style={styles.viewFooter}>
						<View
							style={{
								backgroundColor: colors.appColor,
								flexDirection: "row",
								paddingLeft: 20,
								paddingRight: 10,
								borderRadius: 5
							}}
						>
							<Button
								transparent
								onPress={() => {
									if (isNetwork) {
										this.props.navigation.push("JointAccountSentMoneyScreen");
									} else {
										this.dropdown.alertWithType(
											"info",
											"OH!!",
											"Sorry You're Not Connected to the Internet"
										);
									}
								}}
							>
								<Icon name="angle-up" size={25} color="#ffffff" />
								<Text style={styles.txtTile}>Send</Text>
							</Button>
							<Button
								transparent
								onPress={() =>
									this.props.navigation.push("ReceiveMoneyScreen", {
										address: this.state.address
									})
								}
							>
								<Icon name="angle-down" size={25} color="#ffffff" />
								<Text style={styles.txtTile}>Receive</Text>
							</Button>
						</View>
					</View>
				</Content>
				<DropdownAlert ref={ref => (this.dropdown = ref)} />
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	Savings: {
		flex: 1,
		backgroundColor: colors.Saving,
		width: "100%"
	},
	Secure: {
		flex: 1,
		backgroundColor: colors.Secure,
		width: "100%"
	},
	viewBackBtn: {
		flex: 2,
		flexDirection: "row",
		padding: 15,
		marginTop: Platform.OS == "ios" ? 10 : 25
	},
	viewBalInfo: {
		flex: 5,
		flexDirection: "column",

		padding: 15
	},
	//txtbal info
	txtTile: {
		color: "#ffffff"
	},
	txtAccountType: {
		fontSize: 20,
		fontWeight: "bold"
	},
	txtBalInfo: {
		fontSize: 28,
		fontWeight: "bold"
	},
	//Recent Transaction
	viewMainRecentTran: {
		flex: 2
	},
	viewTitleRecentTrans: {
		marginLeft: 20,
		flexDirection: "row",
		flex: 0.2,
		alignItems: "center"
	},
	//Loading
	loading: {
		marginLeft: 10,
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "center",
		alignContent: "center"
	},
	txtRecentTran: {
		fontWeight: "bold",
		fontSize: 25,
		marginTop: 10
	},
	txtTransTitle: {
		fontWeight: "bold",
		marginBottom: 5
	},
	txtAmoundRec: {
		color: "#228B22",
		fontWeight: "bold"
	},
	txtAmoundSent: {
		color: "red",
		fontWeight: "bold"
	},
	recentTransListView: {
		flex: 1
	},
	//No Transaction
	viewNoTransaction: {
		flex: 1,
		alignItems: "center",
		paddingTop: 20
	},
	txtNoTransaction: {
		fontSize: 20,
		fontWeight: "bold",
		paddingTop: 5
	},
	//TODO:Fotter view
	viewFooter: {
		flex: 0.3,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center"
	},
	txtConfimation: {
		fontSize: 10,
		color: "gray"
	},
	//PopupMenu
	text: {
		fontSize: 18
	}
});
