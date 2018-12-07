//bottom button

       <View style={styles.viewContinueBtn}>
                        <Button
                            title="CREATE WALLET"
                            buttonStyle={styles.buttonStype}
                            onPress={() => this.click_started()}
                        />
                        <Button
                            title="IMPORT WALLET"
                            buttonStyle={styles.buttonStype}
                            onPress={() => {
                                this.setState({ visible: true });
                            }}
                        />
                    </View> 