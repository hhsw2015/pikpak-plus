// Search.tsx
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import './Search.css'
import { IonContent, IonToast } from '@ionic/react'
import SearchGrid from './SearchGrid/SearchGrid'
import { WEBSITES } from '../../constants/constants'
import { search } from 'ionicons/icons'
import CustomInput from '../CustomInput/CustomInput'
import Checkbox from '../checkbox/Checkbox'
import BlockUiLoader from '../BlockUiLoader/BlockUiLoader'
import { SearchInfo, YtsData } from '../../types/sharedTypes'
import CustomIonHeader from '../CustomIonHeader/CustomIonHeader'

export default function Search() {
  const [searchInfoList, setSearchInfoList] = useState<
    SearchInfo[] | YtsData[] | null | any
  >(null)
  const [text, settext] = useState<string>('')
  const [showToast, setShowToast] = useState<{
    message: string
    color: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const fetchData = async (searchTerm: string) => {
    const SITE = 'yts'
    try {
      const response = await axios.get(
        `/torrent/api/v1/search?site=${SITE}&query=${searchTerm}&limit=0&page=1`,
      )
      // const response = await axios.get(`/api/v1/all/search?query=${searchTerm}&limit=5`)
      const data: SearchInfo[] = response.data.data
      data.forEach((item) => {
        if (item && item.error) {
          setShowToast({
            message: item.error,
            color: 'danger',
          })
        } else {
          setSearchInfoList(data)
        }
      })
    } catch (error) {
      setShowToast({
        message: 'An error occurred while fetching data. Please try again.',
        color: 'danger',
      })
    } finally {
      setLoading(false)
    }
  }
  // Memoize the handleTextChange function
  const handleTextChange = useCallback((value: string) => {
    settext(value)
  }, []) // Empty dependency array as there are no external dependencies

  const handleSubmit = (text: string) => {
    const trimmedText = text.trim()
    settext(trimmedText)
    console.log('text: ', trimmedText)
    if (!trimmedText || trimmedText === '') {
      setShowToast({
        message: 'Please enter a valid text.',
        color: 'danger',
      })
      return
    }
    setLoading(true)
    settext('')
    fetchData(trimmedText)
  }

  // const SearchGridMemoized = React.memo(SearchGrid)
  const CheckboxMemoized = React.memo(Checkbox)

  const [SelectedWebsite, setSelectedWebsite] = useState<string[]>([])
  console.log('hi')

  return (
    <>
      <CustomIonHeader title="Search" />

      <IonContent fullscreen={true}>
        <CheckboxMemoized
          customData={WEBSITES}
          SelectedWebsite={SelectedWebsite}
          setSelectedWebsite={setSelectedWebsite}
        />
        <CustomInput
          text={text}
          handleTextChange={handleTextChange}
          handleSubmit={handleSubmit}
          customPlaceholder=" Search... eg: avengers"
          icon={search}
        />
        <BlockUiLoader loading={loading}>
          <div className="container">
            <SearchGrid searchInfoList={searchInfoList} />
          </div>
        </BlockUiLoader>
        <IonToast
          isOpen={!!showToast}
          onDidDismiss={() => setShowToast(null)}
          message={showToast?.message}
          duration={1000}
          color={showToast?.color}
        />
      </IonContent>
    </>
  )
}
