import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Dimensions,
    View,
    Alert,
    StatusBar,
    TouchableOpacity,
    Clipboard,
    ToastAndroid,
} from 'react-native';
import { Container, Header, Title, Content, Button, Left, Right, Body, Text, Footer } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import GridView from "react-native-super-grid";



export default class VerifyBackupPhraseScreen extends React.Component {
    constructor(props) {
        super(props);
        StatusBar.setHidden(false);
        this.state = ({
            numanicValues: [[]],
            verifyNumanicValues: [[]],
            visible: false

        })
    }

    componentWillMount() {
        const { navigation } = this.props;
        const secoundGridArray = navigation.getParam('numanicValues');
        console.log('item id =' + secoundGridArray);
        var temp = [];
        var len = secoundGridArray.length;
        if (len > 0) {
            for (let i = 0; i < len; i++) {
                var data = secoundGridArray[i];
                var joined = { name: data };
                temp.push(joined);
            }
            this.setState({
                numanicValues: temp
            })
        }
    }

    //TODO: Function

    click_SecoundGridItem(item) {

        //First Grid add Values
        var temp = [];
        var joined = { name: item };
        temp.push(joined);
        var joinedCat = this.state.verifyNumanicValues.concat(temp);
        this.setState({
            verifyNumanicValues: joinedCat
        })
        //Secound Grid remove values
        var temp1 = [[]];
        temp1 = this.state.numanicValues;
       
       console.log(JSON.stringify(temp1));






    }



    render() {
        return (
            <Container style={styles.container}>
                <Content>
                    <View style={styles.viewTitle}>
                        <Image
                            style={styles.backupImg}
                            resizeMode='contain'
                            source={require("../../../../assets/images/verifyBackupPhraseScreen/correctOrder.png")}
                        />
                        <Text style={styles.desc}>Tap the words to put them next to each other in the correct order.</Text>

                    </View>
                    <View style={styles.viewNumanicValue}>
                        <GridView
                            itemDimension={100}
                            items={this.state.verifyNumanicValues}
                            style={styles.gridViewFirst}
                            renderItem={item => (
                                <TouchableOpacity onPress={() => Alert.alert('hi')}>
                                    <View style={styles.itemContainerSecound}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />

                    </View>
                    <View>
                        <GridView
                            itemDimension={100}
                            items={this.state.numanicValues}
                            style={styles.gridViewSecound}
                            renderItem={item => (
                                <TouchableOpacity onPress={() => this.click_SecoundGridItem(item.name)}>
                                    <View style={styles.itemContainerSecound}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Content>
                <Footer style={styles.footer}>
                    <Button style={styles.btnNext}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>DONE</Text>
                    </Button>
                </Footer>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    viewTitle: {
        flex: 2,
        alignItems: 'center',
        marginTop: 20,
    },
    backupImg: {
        marginBottom: 20
    },
    desc: {
        textAlign: 'center',
        color: 'gray',
    },
    //Numanic Values show
    viewNumanicValue: {
        backgroundColor: '#ECF0F4',
        marginTop: 30,
        flexDirection: 'row',
        flexWrap: "wrap",
        padding: 10,
    },
    secrityChar: {
        fontSize: 20,
        padding: 1
    },
    btnCopy: {
        alignSelf: 'center',
        fontWeight: 'bold',
        marginTop: 10
    },
    //next button style
    btnNext: {
        backgroundColor: "#F5951D",
        width: Dimensions.get("screen").width - 50,
        height: 40,
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 5,
        marginBottom: 10,
        justifyContent: 'center'
    },
    //secound grid view
    gridViewSecound: {

    },
    itemContainerSecound: {
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 5,
        padding: 5,
        alignItems: 'center',

    },
    //Fotter
    footer: {
        backgroundColor: "transparent",
    }
});
