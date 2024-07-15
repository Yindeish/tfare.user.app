import { absolute, b, bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, justifyStart, l, mb, mt, p, pb, pr, px, py, relative, rounded, w, wFull, wHFull, zIndex } from '@/utils/styles'
import { c, colorBlack, colorWhite, fs12, fs14, fs18, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { images } from '@/constants/images';
import { Image, View } from 'react-native';
import { image } from '@/utils/imageStyles';


function BuyTicketListTile({ leadingText, trailing }: { leadingText: string, trailing: { icon?: boolean, text: string, boldText?: boolean } }) {


    return (
        <View style={[wFull, flex, justifyBetween, itemsCenter]}>
            <Text style={[neurialGrotesk, fs14, fw700, c(Colors.light.textGrey)]}>{leadingText}</Text>

            <View style={[flex, gap(16), itemsCenter]}>
                {trailing?.icon && <Image
                    style={[image.w(20), image.h(20)]}
                    source={images.copyImage}
                />}

                <Text style={[trailing?.boldText || false ? fw700 : fw400, fs14, colorBlack]}>{trailing.text}</Text>
            </View>
        </View>
    )
}

export default BuyTicketListTile;
