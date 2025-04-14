"use client"

import {
  View,
  Image,
  type ViewStyle,
  TextInput,
  type TextStyle,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native"
import { Text } from "react-native-paper"
import { useEffect, useState } from "react"
import SafeScreen from "@/components/shared/safeScreen"
import PaddedScreen from "@/components/shared/paddedScreen"
import { image, wHFull } from "@/utils/imageStyles"
import {
  bg,
  border,
  flex,
  flexCol,
  gap,
  h,
  itemsCenter,
  justifyCenter,
  mt,
  px,
  py,
  rounded,
  wFull,
} from "@/utils/styles"
import Colors from "@/constants/Colors"
import { images } from "@/constants/images"
import { c, colorBlack, colorWhite, fs12, fs14, fw500, neurialGrotesk } from "@/utils/fontStyles"
import AccountPageTitle from "@/components/shared/pageTitle"
import { type Href, router } from "expo-router"
import { tabs } from "@/constants/tabs"
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit"
import { setProfileCta } from "@/state/slices/account"
import type { IUserAccount } from "@/state/types/account"
import * as ImagePicker from "expo-image-picker"
import { useFormik } from "formik"
import { number, ObjectSchema, string } from "yup"
import { useSession as useTokenSession } from "@/contexts/userTokenContext"
import FetchService from "@/services/api/fetch.service"
import ErrorMsg from "@/components/shared/error_msg"
import CloudinaryServices from "@/cloudinary/cloudinary.services"
import { useStorageState } from "@/hooks/useStorageState"
import type { RootState } from "@/state/store"
import AccountSelectors from "@/state/selectors/account"

export default function ProfileInfo() {
  const dispatch = useAppDispatch()
  const { profileCta } = AccountSelectors()
  const [[_, userSession], updateUserSession] = useStorageState("user")
  const parsedUser = JSON.parse(userSession as string) as IUserAccount
  const { user } = useAppSelector((state: RootState) => state.user)
  const { tokenSession } = useTokenSession()

  const [state, setState] = useState({
    msg: "",
    code: null,
    loading: false,
  })

  const { code, msg, loading } = state

  // Simplified image upload state
  const [imageState, setImageState] = useState({
    loading: false,
    picture: user?.picture || null,
    avatar: user?.avatar || null,
  })

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues } = useFormik({
    initialValues: {
      fullName: parsedUser?.fullName || "",
      userName: parsedUser?.fullName || "",
      email: parsedUser?.email || "",
      phoneNumber: String(parsedUser?.phoneNumber) || "",
    },
    validationSchema: new ObjectSchema({
      fullName: string(),
      userName: string(),
      email: string(),
      phoneNumber: number(),
    }),
    onSubmit: async ({ email, fullName, phoneNumber, userName }) => {
      setState((prev) => ({ ...prev, loading: true, msg: "" }))

      const returnedData = await FetchService.patchWithBearerToken({
        token: tokenSession as string,
        url: "/user/account/user/edit",
        data: {
          email,
          fullName,
          phoneNumber,
          profileName: userName,
          picture: imageState.picture || user?.picture,
          avatar: imageState.avatar || user?.avatar,
        },
      })

      setState((prev) => ({
        ...prev,
        loading: false,
        code: returnedData?.code,
        msg: returnedData?.msg,
      }))

      if (returnedData?.code === 200 || returnedData?.code === 201) {
        updateUserSession(JSON.stringify(returnedData?.userProfileUpdated))
        setValues({
          fullName: returnedData?.userProfileUpdated?.fullName || "",
          userName: returnedData?.userProfileUpdated?.fullName || "",
          email: returnedData?.userProfileUpdated?.email || "",
          phoneNumber: String(returnedData?.userProfileUpdated?.phoneNumber) || "",
        })
        dispatch(setProfileCta("edit"))
      }
    },
  })

  // Simplified image picker function
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0].uri) {
        setImageState((prev) => ({ ...prev, loading: true }))

        CloudinaryServices.uploadImage({
          imagePath: result.assets[0].uri,
          folderName: "ridersImages",
          fnToRn: (imageUrl) => {
            setImageState((prev) => ({
              ...prev,
              loading: false,
              picture: imageUrl as string,
            }))
          },
        })
      }
    } catch (error) {
      console.error("Error picking image:", error)
      setImageState((prev) => ({ ...prev, loading: false }))
    }
  }

  // Generate avatar function
  const generateAvatar = () => {
    const AVATAR_API_URL = "https://api.multiavatar.com"
    const userProfileName = values.fullName || user?.fullName;
    const userAvatar = `${AVATAR_API_URL}/${userProfileName}`

    setImageState((prev) => ({ ...prev, avatar: userAvatar }))
  }

  useEffect(() => {
    setValues({
      fullName: (user?.fullName as string) || parsedUser?.fullName,
      userName: (user as any)?.profileName || (user?.fullName as string) || parsedUser?.fullName,
      email: (user?.email as string) || parsedUser?.email,
      phoneNumber: String(user?.phoneNumber as number) || String(parsedUser?.phoneNumber),
    })

    // Initialize image state with user data
    setImageState({
      loading: false,
      picture: user?.picture || null,
      avatar: user?.avatar || null,
    })
  }, [user])

  // Profile image component
  const ProfileImage = () => {
    const imageSource = imageState.picture || imageState.avatar || user?.picture || user?.avatar;
    console.log({imageSource})

    return (
      <View style={[mt(28), flexCol, gap(16), itemsCenter, wFull, h(134)]}>
        <Image
          source={{uri: imageSource}}
          style={[image.w(100), image.h(100), image.rounded(100)]}
        />

        {profileCta === "save" && (
          <View style={[flex, itemsCenter, justifyCenter, gap(20)]}>
            <TouchableOpacity
              onPress={pickImage}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
              }}
            >
              <Text style={[neurialGrotesk, fw500, fs14, c(Colors.light.background)]}>Upload picture</Text>
              {imageState.loading && <ActivityIndicator size={10} />}
            </TouchableOpacity>

            <TouchableOpacity onPress={generateAvatar}>
              <Text style={[neurialGrotesk, fw500, fs14, c(Colors.light.error)]}>Generate Avatar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }

  return (
    <SafeScreen>
      <View style={[wHFull as ViewStyle]}>
        <PaddedScreen>
          {/* Page Header */}
          <AccountPageTitle
            title="Profile Information"
            onPress={() => {
              dispatch(setProfileCta("edit"))
              router.push(`/(tab)/${tabs.account}` as Href)
            }}
            style={[]}
          >
            {/* Edit / Save profile Btn */}
            {profileCta === "edit" ? (
              <TouchableOpacity
                onPress={() => dispatch(setProfileCta("save"))}
                style={[
                  flex,
                  rounded(100),
                  gap(10),
                  py(13),
                  px(26),
                  itemsCenter,
                  bg("#F9F7F8"),
                  { borderColor: Colors.light.border, borderWidth: 0.7 },
                ]}
              >
                <Image source={images.editBtnImage} style={[image.w(18), image.h(18)]} />
                <Text style={[neurialGrotesk, fs12, fw500, colorBlack]}>Edit</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => handleSubmit()}
                style={[
                  flex,
                  rounded(100),
                  gap(10),
                  py(13),
                  px(26),
                  itemsCenter,
                  bg(Colors.light.background),
                  { borderColor: Colors.light.border, borderWidth: 0.7 },
                ]}
              >
                <Image source={images.whiteBgEditBtnImage} style={[image.w(18), image.h(18)]} />
                <Text style={[neurialGrotesk, fs12, fw500, colorWhite]}>Save</Text>
              </TouchableOpacity>
            )}
          </AccountPageTitle>

          {loading && <ActivityIndicator />}

          {/* User avatar */}
          <ProfileImage />

          {/* Form */}
          <View style={[wFull, flexCol, gap(16), mt(60)]}>
            {/* Form fields */}
            <TextInput
              style={[
                border(0.7, "#D7D7D7") as TextStyle,
                rounded(10) as TextStyle,
                wFull as TextStyle,
                h(50) as TextStyle,
                px(24) as TextStyle,
                bg("#F9F7F8") as TextStyle,
                errors.fullName && touched.fullName ? { borderColor: Colors.light.error } : undefined,
              ]}
              placeholderTextColor={Colors.light.textGrey}
              placeholder="Full Name"
              keyboardType="default"
              value={values.fullName}
              autoCorrect={false}
              onChangeText={profileCta === "save" ? handleChange("fullName") : () => {}}
              onBlur={handleBlur("fullName")}
              editable={profileCta === "save"}
            />

            <TextInput
              style={[
                border(0.7, "#D7D7D7") as TextStyle,
                rounded(10) as TextStyle,
                wFull as TextStyle,
                h(50) as TextStyle,
                px(24) as TextStyle,
                bg("#F9F7F8") as TextStyle,
                errors.userName && touched.userName ? { borderColor: Colors.light.error } : undefined,
              ]}
              placeholderTextColor={Colors.light.textGrey}
              placeholder="User Name"
              keyboardType="default"
              value={values.userName}
              autoCorrect={false}
              onChangeText={profileCta === "save" ? handleChange("userName") : () => {}}
              onBlur={handleBlur("userName")}
              editable={profileCta === "save"}
            />

            <TextInput
              style={[
                border(0.7, "#D7D7D7") as TextStyle,
                rounded(10) as TextStyle,
                wFull as TextStyle,
                h(50) as TextStyle,
                px(24) as TextStyle,
                bg("#F9F7F8") as TextStyle,
                errors.email && touched.email ? { borderColor: Colors.light.error } : undefined,
              ]}
              placeholderTextColor={Colors.light.textGrey}
              placeholder="Email Address"
              keyboardType="email-address"
              value={values.email}
              autoCorrect={false}
              onChangeText={profileCta === "save" ? handleChange("email") : () => {}}
              onBlur={handleBlur("email")}
              editable={profileCta === "save"}
            />

            <TextInput
              style={[
                border(0.7, "#D7D7D7") as TextStyle,
                rounded(10) as TextStyle,
                wFull as TextStyle,
                h(50) as TextStyle,
                px(24) as TextStyle,
                bg("#F9F7F8") as TextStyle,
                errors.phoneNumber && touched.phoneNumber ? { borderColor: Colors.light.error } : undefined,
              ]}
              placeholderTextColor={Colors.light.textGrey}
              placeholder="Phone Number"
              keyboardType="numeric"
              value={values.phoneNumber}
              autoCorrect={false}
              onChangeText={profileCta === "save" ? handleChange("phoneNumber") : () => {}}
              onBlur={handleBlur("phoneNumber")}
              editable={profileCta === "save"}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <ErrorMsg msg={msg} code={code} />
          </View>
        </PaddedScreen>
      </View>
    </SafeScreen>
  )
}
