import React from 'react';
import {
	Image,
	Platform,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
	Alert,
	ImageBackground,
} from 'react-native';
import { Container, Header, Title, Content, Button, Left, Right, Body, Text, Input,Item  } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import WalletService from "../../../bitcoin/services/WalletService";
var dbOpration = require("../../../app/manager/database/DBOpration");
import { AsyncStorage } from "react-native"


//TODO: Custome Pages
import { colors, images, localDB } from "../../../app/constants/Constants";




export default class MergeConfirmJointAccountScreen extends React.Component {

	constructor() {
        super();
        this.state = ({
			Creator:"bithyve user",
            Name: 'Your Name',
            WalletName: 'Wallet Name',
            JsonString: "empty"
        });
	}
	

	async componentDidMount() {
		this.setState({
			JsonString: this.props.navigation.getParam('JsonString', "Empty")
		})
		let Joint = JSON.parse(this.props.navigation.getParam('JsonString', "Empty"))
		this.setState({ Creator: Joint.CN })
		this.setState({ WalletName: Joint.WN })

	}

	storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            // Error saving data
        }
	}
	
	handlePress(){
		this.CreateMultisigAndStore(this.props.navigation.getParam('JsonString', "Empty"),this.state.Name)
		this.props.navigation.push("AcknowledgeJointAccountScreen")
	}

	async CreateMultisigAndStore(joint:string,name:string){
		const resultWallet = await dbOpration.readTablesData(
            localDB.tableName.tblWallet
        );
        console.log("mnemonics:", resultWallet.temp[0].mnemonic)
        const {
            keyPair
		} = await WalletService.importWallet(resultWallet.temp[0].mnemonic);
		let Joint = JSON.parse(joint)
		Joint.MPky = keyPair.publicKey.toString('hex')
		Joint.MN = name
		const {
			p2wsh,
			p2sh,
			address
		} = await WalletService.createMultiSig(2,[Joint.CPky,Joint.MPky]);
		Joint.p2wsh = p2wsh
		Joint.p2sh  = p2sh
		Joint.Add  = address
		await this.storeData("Joint",JSON.stringify(Joint))
	}

	//this.props.navigation.navigate("AcknowledgeJointAccountScreen",{JsonString:data.barcode})

	render() {
		return (
			<Container>
				<ImageBackground
					source={images.appBackgound}
					style={styles.container}
				>

					<Header transparent>
						<Left>
							<Button transparent onPress={() => this.props.navigation.goBack()}>
								<Icon name='chevron-left' size={25} color="#ffffff" />
							</Button>
						</Left>

						<Body style={{ flex: 0, alignItems: 'center' }}>
							<Title adjustsFontSizeToFit={true}
								numberOfLines={1} style={styles.titleUserName}>Merge Confirmation</Title>
						</Body>
						<Right></Right>
					</Header>
					<Content>
						<Text>
							Do you want to merge {this.state.WalletName} wallet with {this.state.Creator}?
						 </Text>
						 <Item rounded>
                            <Input placeholder='Enter Your Name' onChangeText={(text) => this.setState({ Name: text })} value={this.state.Name} />
                        </Item>
						<Text>
							output {this.state.Name}
						 </Text>
						<Button success style={{ padding: '10%', alignSelf: 'center' }} onPress={() => this.handlePress() }><Text> Merge </Text></Button>
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
	titleUserName: {
		color: "#ffffff"
	},
});
