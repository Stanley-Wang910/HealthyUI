import * as React from 'react'
import ButtonWrapper from './ButtonWrapper'
import EmotionCss from './EmotionCss'
import PopoverMenu from './PopOverMenu'
import { css } from '@emotion/react'
import SliderWrapper from './EmotionMUISlider'

const style = css`
  color: red !important;

  :hover {
    color: #2e8b57;
  }
`

const StyleExamples = () => {
  return (
    <>
      {/*
        this is tailwind by class
        */}
      <div className={'text-red-600'}>
        ** some component examples from MUI **
      </div>

      <ButtonWrapper />
      <EmotionCss />
      <SliderWrapper />
      <PopoverMenu />

      <div css={style}>** // some components examples from MUI </div>
    </>
  )
}

export default StyleExamples
