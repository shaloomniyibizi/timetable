'use client';

import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { E164Number } from 'libphonenumber-js/core';
import Image from 'next/image';
import ReactDatePicker from 'react-datepicker';
import { Control } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';

export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton',
}

interface CustomProps {
  control: Control<any>;
  name: string;
  id?: string;
  label?: string;
  type?: string;
  description?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  autoCapitalize?: string;
  autoComplete?: string;
  autoCorrect?: string;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
}

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className='w-full'>
          <div className='flex items-center'>
            {props.iconSrc && (
              <Image
                src={props.iconSrc}
                height={24}
                width={24}
                alt={props.iconAlt || 'icon'}
                className='ml-2'
              />
            )}
            <FormControl>
              <Input
                placeholder={props.placeholder}
                type={props.type}
                {...field}
                className='w-full'
              />
            </FormControl>
          </div>
          <FormDescription>{props.description}</FormDescription>
        </div>
      );
    case FormFieldType.TEXTAREA:
      return (
        <>
          <FormControl>
            <Textarea
              placeholder={props.placeholder}
              {...field}
              className='shad-textArea'
              disabled={props.disabled}
            />
          </FormControl>
          <FormDescription>{props.description}</FormDescription>
        </>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <>
          <FormControl>
            <PhoneInput
              defaultCountry='RW'
              placeholder={props.placeholder}
              international
              withCountryCallingCode
              value={field.value as E164Number | undefined}
              onChange={field.onChange}
              className='flex h-9 w-full rounded border border-b-2 border-b-input bg-accent/65 px-2 py-1 text-sm text-accent-foreground shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:border-b-primary focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50'
            />
          </FormControl>
          <FormDescription>{props.description}</FormDescription>
        </>
      );
    case FormFieldType.CHECKBOX:
      return (
        <>
          <FormControl>
            <div className='flex items-center gap-4'>
              <Checkbox
                id={props.name}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <label htmlFor={props.name} className='checkbox-label'>
                {props.label}
              </label>
            </div>
          </FormControl>
          <FormDescription>{props.description}</FormDescription>
        </>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className='border-dark-500 bg-dark-400 flex rounded-md border'>
          <Image
            src='/assets/icons/calendar.svg'
            height={24}
            width={24}
            alt='user'
            className='ml-2'
          />
          <FormControl>
            <ReactDatePicker
              showTimeSelect={props.showTimeSelect ?? false}
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              timeInputLabel='Time:'
              dateFormat={props.dateFormat ?? 'MM/dd/yyyy'}
              wrapperClassName='date-picker'
            />
          </FormControl>
          <FormDescription>{props.description}</FormDescription>;
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className='shad-select-trigger'>
                  <SelectValue placeholder={props.placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className='shad-select-content'>
                {props.children}
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>{props.description}</FormDescription>
        </>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, name, label } = props;

  return (
    <FormField
      control={control}
      name={name}
      disabled={props.disabled}
      render={({ field }) => (
        <FormItem className='w-full flex-1'>
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className='shad-input-label'>{label}</FormLabel>
          )}
          <RenderInput field={field} props={props} />

          <FormMessage className='shad-error' />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
