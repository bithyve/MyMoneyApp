import React from 'react';
import {
	Image,
	Platform,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
	Alert,
	Dimensions,
	ImageBackground,
	Clipboard,
} from 'react-native';
import { Container, Header, Title, Content, Button, Left, Right, Body, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AsyncStorage } from "react-native"
import { QRCode } from "react-native-custom-qr-codes";


//TODO: Custome Pages
import { colors, images, localDB } from "../../../app/constants/Constants";




export default class AcknowledgeJointAccountScreen extends React.Component {
	constructor() {
		super();
		this.state = ({
			JsonString: "empty"
		});
	}

	click_CopyAddress() {
		Clipboard.setString(this.state.JsonString);
		Toast.show("Copied !!", Toast.SHORT);
	}

	retrieveResolveData = async () => {
		try {
			const value = await AsyncStorage.getItem("Joint");
			if (value !== null) {
				let Joint = JSON.parse(value)
				Joint.p2sh = ""
				Joint.p2wsh = ""
				this.setState({
					JsonString: JSON.stringify(Joint)
				})
			}
		} catch (error) {
			// Error retrieving data
		}
	}

	componentDidMount() {
		this.retrieveResolveData()
	}


	render() {
		return (
			<Container>
				<ImageBackground
					source={images.appBackgound}
					style={styles.container}
				>

					<Header transparent>
						<Left>
							<Button transparent onPress={() => { this.props.navigation.goBack() }}>
								<Icon name='chevron-left' size={25} color="#ffffff" />
							</Button>
						</Left>

						<Body style={{ flex: 0, alignItems: 'center' }}>
							<Title adjustsFontSizeToFit={true}
								numberOfLines={1} style={styles.titleUserName}>Acknowledge Joint Account</Title>
						</Body>
						<Right></Right>
					</Header>
					<Content>
						{/* <View style={styles.viewShowQRcode}>
							<QRCode
								logo={images.appIcon}
								content={this.state.JsonString}
								size={Dimensions.get("screen").width - 40}
								codeStyle="square"
								outerEyeStyle="square"
								innerEyeStyle="square"
								//linearGradient={['rgb(255,0,0)','rgb(0,255,255)']}
								padding={1}
							/>
							<TouchableOpacity onPress={() => this.click_CopyAddress()}>
								<Text style={styles.txtBarcode} note>
									{this.state.JsonString}
								</Text>
							</TouchableOpacity>
						</View> */}
						<Text>
							Please ask other party to scan the following code by going into joint account and click merge button
						</Text>
						<Text>
							{this.state.JsonString}
						</Text>
					</Content>

				</ImageBackground>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	viewShowQRcode: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	txtBarcode: {
		marginTop: 40,
		marginBottom: 20,
		fontSize: 16,
		textAlign: "center"
	},
	titleUserName: {
		color: "#ffffff"
	},
});
