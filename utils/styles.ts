import Colors from "@/constants/Colors";
import { ViewStyle } from "react-native";

type ViewStyleProp = Record<string, ViewStyle>;

const utilStyles: ViewStyleProp = {
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
    },
    relative: {
        position: 'relative'
    },
    absolute: {
        position: 'absolute'
    },
    top0: {
        top: 0
    },
    left0: {
        left: 0
    },
    right0: {
        right: 0
    },
    bottom0: {
        bottom: 0
    },

}


export const { flexCenter, flexXCenter, flexYCenter, flex, flexCol, itemsCenter, itemsStart, itemsEnd, justifyBetween, justifyCenter, justifyStart, justifyEnd, wFull, hFull, wHFull, pAuto, pXAuto, pYAuto, pTAuto, pBAuto, pRAuto, pLAuto, mAuto, mXAuto, mYAuto, mTAuto, mBAuto, mRAuto, mLAuto, relative, absolute, top0, left0, right0, bottom0 } = utilStyles;

// FS -> Functional Styles
// VFS -> View FS
// VFS -> Text FS
type VFS = <T extends number | string >(val: T) => ViewStyle;
type VFSProp = { w: VFS, maxw: VFS, h: VFS, maxh: VFS, t: VFS, l: VFS, r: VFS, b: VFS, bg: VFS, zIndex: VFS, gap: VFS, m: VFS, mx: VFS, my: VFS, mt: VFS, mb: VFS, ml: VFS, mr: VFS, p: VFS, px: VFS, py: VFS, pt: VFS, pb: VFS, pl: VFS, pr: VFS, rounded: VFS, borderGrey: VFS, border: (w: number, c: string) => ViewStyle; borderT: (w: number, c: string) => ViewStyle; borderR: (w: number, c: string) => ViewStyle; borderL: (w: number, c: string) => ViewStyle; borderB: (w: number, c: string) => ViewStyle; borderY: (w: number, c: string) => ViewStyle; borderX: (w: number, c: string) => ViewStyle; };

export const { w, maxw, h, maxh, t, l, r, b, bg, zIndex, gap, m, mx, my, mt, mb, ml, mr, p, px, py, pt, pb, pl, pr, rounded, border, borderGrey, borderB, borderL, borderR, borderT, borderX, borderY }: VFSProp = {
    w: (val) => {
        return {
            width: val as number
        }
    },
    maxw: (val) => {
        return {
            maxWidth: val as number
        }
    },
    h: (val) => {
        return {
            height: val as number
        }
    },
    maxh: (val) => {
        return {
            maxHeight: val as number
        }
    },
    t: (val) => {
        return {
            top: val as number
        }
    },
    l: (val) => {
        return {
            left: val as number
        }
    },
    r: (val) => {
        return {
            right: val as number
        }
    },
    b: (val) => {
        return {
            bottom: val as number
        }
    },
    bg: (val) => {
        return {
            backgroundColor: val as string
        }
    },
    zIndex: (val) => {
        return {
            zIndex: val as number
        }
    },
    gap: (val) => {
        return {
            gap: val as number
        }
    },
    m: (val) => {
        return {
            margin: val as number
        }
    },
    mx: (val) => {
        return {
            marginLeft: val as number,
            marginRight: val as number,
        }
    },
    my: (val) => {
        return {
            marginTop: val as number,
            marginBottom: val as number,
        }
    },
    mt: (val) => {
        return {
            marginTop: val as number
        }
    },
    mb: (val) => {
        return {
            marginBottom: val as number
        }
    },
    ml: (val) => {
        return {
            marginLeft: val as number
        }
    },
    mr: (val) => {
        return {
            marginRight: val as number
        }
    },
    p: (val) => {
        return {
            padding: val as number
        }
    },
    px: (val) => {
        return {
            paddingLeft: val as number,
            paddingRight: val as number,
        }
    },
    py: (val) => {
        return {
            paddingTop: val as number,
            paddingBottom: val as number,
        }
    },
    pt: (val) => {
        return {
            paddingTop: val as number
        }
    },
    pb: (val) => {
        return {
            paddingBottom: val as number
        }
    },
    pl: (val) => {
        return {
            paddingLeft: val as number
        }
    },
    pr: (val) => {
        return {
            paddingRight: val as number
        }
    },
    rounded: (val) => {
        return {
            borderRadius: val as number
        }
    },
    borderGrey: (val: any) => {
        return {
            borderColor: Colors.light.border,
            borderWidth: val ?? 1,
        }
    },
    border: (w, c) => {
        return {
            borderColor: c,
            borderWidth: w,
        }
    },
    borderT: (w, c) => {
        return {
            borderTopColor: c,
            borderTopWidth: w,
        }
    },
    borderR: (w, c) => {
        return {
            borderRightColor: c,
            borderRightWidth: w,
        }
    },
    borderL: (w, c) => {
        return {
            borderLeftColor: c,
            borderLeftWidth: w,
        }
    },
    borderB: (w, c) => {
        return {
            borderBottomColor: c,
            borderBottomWidth: w,
        }
    },
    borderY: (w, c) => {
        return {
            borderBottomColor: c,
            borderBottomWidth: w,
            borderTopColor: c,
            borderTopWidth: w,
        }
    },
    borderX: (w, c) => {
        return {
            borderRightColor: c,
            borderRightWidth: w,
            borderLeftColor: c,
            borderLeftWidth: w,
        }
    },
}
