/** @jsxImportSource @emotion/react */
import { Slider } from '@mui/material'
import { css } from '@emotion/react'

/*
 * this uses a MUI component with emotion (which ships as default in MUI)
 * */
const style = css`
  color: red;
  background: orange;
  :hover {
    color: #2e8b57;
  }
`
const SliderWrapper = () => (
  <>
    <Slider />
    <Slider
      className="my-4"
      css={style}
      defaultValue={30}
      classes={{ active: 'shadow-none' }}
      slotProps={{ thumb: { className: 'hover:shadow-none' } }}
    />
  </>
)

export default SliderWrapper
