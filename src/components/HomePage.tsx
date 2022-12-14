import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import './styles.css'
import { getServiceResponse, IreturnAddress } from '../service/ServiceApi'


export const HomePage = () => {
  const [returnAPi, setReturnApi] = useState<IreturnAddress>({} as IreturnAddress)
  const [cep, setCep] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')
  const [information, setInformation] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    getServiceResponse(cep).then((data) => {
      if (JSON.stringify(data) === JSON.stringify({})) {
        setError('Por favor, digite o CEP corretamente')
      } else {
        setReturnApi(data)
      }
    })
      .catch(err => {
        if (err !== undefined) {
        }
      })
  }, [cep])

  const maskCep = (inputValue: string) => {
    return inputValue.replace(/\D/g, '').replace(/^(\d{5})(\d{3})+?$/, '$1-$2');
  }

  const handleChange = (event: any) => {
    let value = maskCep(event.target.value)
    setInputValue(value)
  }

  const resetInput = (e: any) => {
    e.target.value = "";
    setInformation(false)
    setError(null)
  }

  const handleClick = () => {
    setCep(inputValue)
    setInformation(true)
    setError(null)
  }

  return (
    <div className='homePage'>
      <form onSubmit={handleSubmit(handleClick)}>
        <input
          placeholder='ZipCode*'
          className='userInput'
          {
          ...register('inputValue', { required: true, minLength: 9 })}
          maxLength={9}
          onChange={handleChange}
          value={inputValue}
          onFocus={(e) => resetInput(e)}
        />
        <input type="submit" className='submitButton' />
        {errors?.inputValue?.type === "required" && <p className='errorMessage'>Este campo é obrigatório!</p>}
        {errors?.inputValue?.type === "minLength" && <p className='errorMessage'>O número mínimo de caracteres são 9!</p>}
        {!!information && error && <p className='errorMessage'>{error}</p>}

      </form>
      <div className='returnApi'>
        <p>Street: {information && !error && (returnAPi.logradouro)}</p>
        <p>District: {information && !error && (returnAPi.bairro)}</p>
        <p>City: {information && !error && (returnAPi.localidade)}</p>
        <p>State: {information && !error && (returnAPi.uf)}</p>
      </div>
      <input type="submit" className='submitButtonSmallScreen' />
    </div>
  )
}
