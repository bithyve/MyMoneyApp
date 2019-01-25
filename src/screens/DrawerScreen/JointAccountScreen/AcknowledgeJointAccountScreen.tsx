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
import { Container, Header, Title, Content, Button, Left, Right, Body, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';


//TODO: Custome Pages
import { colors, images, localDB } from "../../../app/constants/Constants";




export default class AcknowledgeJointAccountScreen extends React.Component {
	constructor() {
		super();
		this.state = ({
			JsonString: "empty",
			Creator: "test",
			Merger: "test2"
		});
	}

	componentDidMount() {
		this.setState({
			JsonString: this.props.navigation.getParam('JsonString', "Empty")
		})
		let Joint = JSON.parse(this.props.navigation.getParam('JsonString', "Empty"))
		Joint.MN = this.props.navigation.getParam('Name', "Empty")
		this.setState({ Creator: Joint.CN })
	}

	async createmulitsig() {
		let Joint = JSON.parse(this.state.JsonString)
		this.setState({ Creator: Joint.CN })

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
							<Button transparent onPress={() => { this.props.navigation.goBack()}}>
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
						<Text>
							Please ask other party to scan the following code by going into joint account and click merge button
						</Text>
						<Text>
							{this.state.JsonString}
						</Text>
						<Text>
							{this.state.Creator} is creator {this.state.Merger} is merger
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
	titleUserName: {
		color: "#ffffff"
	},
});
