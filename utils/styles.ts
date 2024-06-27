import { ViewStyle } from "react-native";

const utilStyles: Record<string, ViewStyle> = {
    flexCenter: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    flexXCenter: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    flexYCenter: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    flex: {
        display: 'flex',
        flexDirection: 'row',
    },
    flexCol: {
        display: 'flex',
        flexDirection: 'column',
    },
    itemsCenter: {
        alignItems: 'center'
    },
    itemsStart: {
        alignItems: 'flex-start'
    },
    itemsEnd: {
        alignItems: 'flex-end'
    },
    justifyCenter: {
        justifyContent: 'center'
    },
    justifyBetween: {
        justifyContent: 'space-between',
    },
    justifyStart: {
        justifyContent: 'flex-start',
    },
    justifyEnd: {
        justifyContent: 'flex-end',
    },
    wFull: {
        width: '100%'
    },
    hFull: {
        height: '100%'
    },
    wHFull: {
        width: '100%',
        height: '100%'
    },
    pAuto: {
        paddingTop: 'auto',
        paddingBottom: 'auto',
        paddingRight: 'auto',
        paddingLeft: 'auto'
    },
    pXAuto: {
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    pYAuto: {
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    pTAuto: {
        paddingTop: 'auto',
    },
    pBAuto: {
        paddingBottom: 'auto',
    },
    pRAuto: {
        paddingRight: 'auto',
    },
    pLAuto: {
        paddingLeft: 'auto'
    },
    mXAuto: {
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    mYAuto: {
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    mTAuto: {
        marginTop: 'auto',
    },
    mBAuto: {
        marginBottom: 'auto',
    },
    mRAuto: {
        marginRight: 'auto',
    },
    mLAuto: {
        marginLeft: 'auto'
    }
}

export const { flexCenter, flexXCenter, flexYCenter, flex, flexCol, itemsCenter, itemsStart, itemsEnd, justifyBetween, justifyCenter, justifyStart, justifyEnd, wFull, hFull, wHFull, pAuto, pXAuto, pYAuto, pTAuto, pBAuto, pRAuto, pLAuto, mAuto, mXAuto, mYAuto, mTAuto, mBAuto, mRAuto, mLAuto } = utilStyles;