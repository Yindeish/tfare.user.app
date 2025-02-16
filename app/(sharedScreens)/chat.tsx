import PaddedScreen from "@/components/shared/paddedScreen";
import SafeScreen from "@/components/shared/safeScreen";
import { wHFull } from "@/utils/imageStyles";
import { FlatList, View, ViewStyle } from "react-native";



function Chat() {


    return (
        <SafeScreen>
            <PaddedScreen>
                <View style={[wHFull as ViewStyle]}>

                </View>
            </PaddedScreen>
        </SafeScreen>
    )
}

export default Chat;

{/* <FlatList
    scrollEnabled
    // data={userRide?.tickets}
    data={[]}
    renderItem={({ item, index }) => (
        <>
            {(item?.pickupBusstop && item?.dropoffBusstop) ? (<View style={[wFull, flexCol, gap(32), mt(32)]}> */}
{/* <Text style={[colorBlack, neurialGrotesk, fw700, fs14]}>Ticket {index + 1}</Text> */ }

{/* Pick up block */ }

{/* <View style={[wFull, flexCol, gap(16), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]}>
                    <View style={[flexCol, gap(15)]}>
                        <View style={[flex, gap(12), itemsCenter]}>
                            <Image source={images.greenBgCoasterImage} style={[image.w(20), image.h(20)]} />

                            <Text style={[c(Colors.light.border), neurialGrotesk, fw400, fs12]}>Pick up Bus Stop</Text>
                        </View>

                        <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{pickupBusstopInput}</Text>
                    </View>
                </View> */}

{/* Pick up block */ }
{/* Drop off block */ }

{/* <View style={[wFull, flex, justifyBetween, pr(16), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]}>
                    <View style={[flexCol, gap(15)]}>
                        <View style={[flex, gap(12), itemsCenter]}>
                            <Image source={images.redBgCoasterImage} style={[image.w(20), image.h(20)]} />

                            <Text style={[c(Colors.light.border), neurialGrotesk, fw400, fs12]}>Pick up Bus Stop</Text>
                        </View>

                        <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{pickupBusstopInput}</Text>
                    </View>

                    <View style={[flexCol, gap(16), justifyStart]}>
                        <View style={[flex, itemsCenter, gap(8)]}>
                            <Image style={[image.w(14), image.h(11)]} source={images.rideOfferImage} />
                            <Text style={[c(Colors.light.textGrey), neurialGrotesk, fw400, fs12]}>Ticket fee</Text>
                        </View>

                        <Text style={[colorBlack, fw700, fs14, neurialGrotesk]}> ₦ 550.00</Text>
                    </View>
                </View> */}
{/* Drop off block */ }

//             </View>)
//                 :
//                 // (<View style={[wFull, flexCol, gap(32), itemsStart, mt(40)]}>

//                 //     <View style={[flex, itemsCenter, gap(4)]}>
//                 //         <Text style={[colorBlack, fw700, fs14, neurialGrotesk]}>{`Ticket ${userRide?.tickets?.length as number}`}</Text>

//                 //         <Text style={[fw400, fs12, c(Colors.light.textGrey)]}>(You have selected more than 1 seat)</Text>
//                 //     </View>

//                 //     <View style={[flex, gap(12), itemsCenter]}>

//                 //         <Checkbox
//                 //             value={true ? true : false}
//                 //             onValueChange={() => {

//                 //             }
//                 //             }
//                 //             color={true ? '#27AE65' : colors.grey500}
//                 //         />

//                 //         <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.textGrey)]}>Same pickup and dropoff as Ticket 1?</Text>
//                 //     </View>

//                 //     {!ticketAsTicket1 && <TouchableOpacity onPress={() => dispatch(openModal())}>
//                 //         <View style={[w('auto'), h(50), p(16), rounded(100), flex, itemsCenter, justifyCenter, gap(10), bg(colors.white), { borderWidth: 0.7, borderColor: Colors.light.border }]}>
//                 //             <Image style={[image.w(20), image.h(20)]} source={images.blackBgWaitChairImage} />

//                 //             <Text style={[neurialGrotesk, fw500, fs12, colorBlack]}>Select Ticket Details</Text>
//                 //         </View>
//                 //     </TouchableOpacity>}

//                 //     {true && <>
//                 //         {/* Pick up block */}

//                 //         <View style={[wFull, flexCol, gap(16), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]}>
//                 //             <View style={[flexCol, gap(15)]}>
//                 //                 <View style={[flex, gap(12), itemsCenter]}>
//                 //                     <Image source={images.greenBgCoasterImage} style={[image.w(20), image.h(20)]} />

//                 //                     <Text style={[c(Colors.light.border), neurialGrotesk, fw400, fs12]}>Pick up Bus Stop</Text>
//                 //                 </View>

//                 //                 <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{pickupBusstopInput}</Text>
//                 //             </View>
//                 //         </View>

//                 //         {/* Pick up block */}
//                 //         {/* Drop off block */}

//                 //         <View style={[wFull, flex, justifyBetween, pr(16), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]}>
//                 //             <View style={[flexCol, gap(15)]}>
//                 //                 <View style={[flex, gap(12), itemsCenter]}>
//                 //                     <Image source={images.redBgCoasterImage} style={[image.w(20), image.h(20)]} />

//                 //                     <Text style={[c(Colors.light.border), neurialGrotesk, fw400, fs12]}>Pick up Bus Stop</Text>
//                 //                 </View>

//                 //                 <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{pickupBusstopInput}</Text>
//                 //             </View>

//                 //             <View style={[flexCol, gap(16), justifyStart]}>
//                 //                 <View style={[flex, itemsCenter, gap(8)]}>
//                 //                     <Image style={[image.w(14), image.h(11)]} source={images.rideOfferImage} />
//                 //                     <Text style={[c(Colors.light.textGrey), neurialGrotesk, fw400, fs12]}>Ticket fee</Text>
//                 //                 </View>

//                 //                 <Text style={[colorBlack, fw700, fs14, neurialGrotesk]}> ₦ 550.00</Text>
//                 //             </View>
//                 //         </View>
//                 //         {/* Drop off block */}

//                 //     </>}
//                 // </View>)
//             }
//         </>
//     )}
// />


{/* <View style={[wFull]}>
    {userRide?.tickets?.map((item, index) => ( */}
// <>
{/* {true */ }
{/* // (item.pickupBusstop && item.dropoffBusstop) */ }
{/* ? */ }
{/* // (<View style={[wFull, flexCol, gap(32), mt(32)]}>
                //     <Text style={[colorBlack, neurialGrotesk, fw700, fs14]}>Ticket {index + 1}</Text>

                //     {/* Pick up block */}

//     <View style={[wFull, flexCol, gap(16), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]}>
//         <View style={[flexCol, gap(15)]}>
//             <View style={[flex, gap(12), itemsCenter]}>
//                 <Image source={images.greenBgCoasterImage} style={[image.w(20), image.h(20)]} />

//                 <Text style={[c(Colors.light.border), neurialGrotesk, fw400, fs12]}>Pick up Bus Stop</Text>
//             </View>

//             <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{pickupBusstopInput}</Text>
//         </View>
//     </View>

//     {/* Pick up block */}
//     {/* Drop off block */}

//     <View style={[wFull, flex, justifyBetween, pr(16), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]}>
//         <View style={[flexCol, gap(15)]}>
//             <View style={[flex, gap(12), itemsCenter]}>
//                 <Image source={images.redBgCoasterImage} style={[image.w(20), image.h(20)]} />

//                 <Text style={[c(Colors.light.border), neurialGrotesk, fw400, fs12]}>Pick up Bus Stop</Text>
//             </View>

//             <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{pickupBusstopInput}</Text>
//         </View>

//         <View style={[flexCol, gap(16), justifyStart]}>
//             <View style={[flex, itemsCenter, gap(8)]}>
//                 <Image style={[image.w(14), image.h(11)]} source={images.rideOfferImage} />
//                 <Text style={[c(Colors.light.textGrey), neurialGrotesk, fw400, fs12]}>Ticket fee</Text>
//             </View>

//             <Text style={[colorBlack, fw700, fs14, neurialGrotesk]}> ₦ 550.00</Text>
//         </View>
//     </View>
//     {/* Drop off block */}

{/* // </View>) */ }
// :
{/* // (<View style={[wFull, flexCol, gap(32), itemsStart, mt(40)]}> */ }

//     <View style={[flex, itemsCenter, gap(4)]}>
//         <Text style={[colorBlack, fw700, fs14, neurialGrotesk]}>{`Ticket ${userRide?.tickets?.length as number}`}</Text>

//         <Text style={[fw400, fs12, c(Colors.light.textGrey)]}>(You have selected more than 1 seat)</Text>
//     </View>

//     <View style={[flex, gap(12), itemsCenter]}>

//         <Checkbox
//             value={true ? true : false}
//             onValueChange={() => {

//             }
//             }
//             color={true ? '#27AE65' : colors.grey500}
//         />

//         <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.textGrey)]}>Same pickup and dropoff as Ticket 1?</Text>
//     </View>

//     {!ticketAsTicket1 && <TouchableOpacity onPress={() => dispatch(openModal())}>
//         <View style={[w('auto'), h(50), p(16), rounded(100), flex, itemsCenter, justifyCenter, gap(10), bg(colors.white), { borderWidth: 0.7, borderColor: Colors.light.border }]}>
//             <Image style={[image.w(20), image.h(20)]} source={images.blackBgWaitChairImage} />

//             <Text style={[neurialGrotesk, fw500, fs12, colorBlack]}>Select Ticket Details</Text>
//         </View>
//     </TouchableOpacity>}

//     {true && <>
//         {/* Pick up block */}

//         <View style={[wFull, flexCol, gap(16), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]}>
//             <View style={[flexCol, gap(15)]}>
//                 <View style={[flex, gap(12), itemsCenter]}>
//                     <Image source={images.greenBgCoasterImage} style={[image.w(20), image.h(20)]} />

//                     <Text style={[c(Colors.light.border), neurialGrotesk, fw400, fs12]}>Pick up Bus Stop</Text>
//                 </View>

//                 <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{pickupBusstopInput}</Text>
//             </View>
//         </View>

//         {/* Pick up block */}
//         {/* Drop off block */}

//         <View style={[wFull, flex, justifyBetween, pr(16), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]}>
//             <View style={[flexCol, gap(15)]}>
//                 <View style={[flex, gap(12), itemsCenter]}>
//                     <Image source={images.redBgCoasterImage} style={[image.w(20), image.h(20)]} />

//                     <Text style={[c(Colors.light.border), neurialGrotesk, fw400, fs12]}>Pick up Bus Stop</Text>
//                 </View>

//                 <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{pickupBusstopInput}</Text>
//             </View>

//             <View style={[flexCol, gap(16), justifyStart]}>
//                 <View style={[flex, itemsCenter, gap(8)]}>
//                     <Image style={[image.w(14), image.h(11)]} source={images.rideOfferImage} />
//                     <Text style={[c(Colors.light.textGrey), neurialGrotesk, fw400, fs12]}>Ticket fee</Text>
//                 </View>

//                 <Text style={[colorBlack, fw700, fs14, neurialGrotesk]}> ₦ 550.00</Text>
//             </View>
//         </View>
//         {/* Drop off block */}

//     </>}
// </View>)}
// </>
// ))}
// </View>