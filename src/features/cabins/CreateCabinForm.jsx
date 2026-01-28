import { useForm } from 'react-hook-form';

import PropTypes from 'prop-types';
import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';
import FormRow from '../../ui/FormRow';

import { useCreateCabin } from './useCreateCabin';
import { useUpdateCabin } from './useUpdateCabin';

function CreateCabinForm({ cabinToUpdate = {}, onCloseModal }) {
  const { isCreating, createCabin } = useCreateCabin();
  const { isUpdating, updateCabin } = useUpdateCabin();
  const isWorking = isCreating || isUpdating;

  const { id: updateId, ...updateValues } = cabinToUpdate;
  const isEditSession = Boolean(updateId);

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? updateValues : {},
  });

  const { errors } = formState;

  function onSubmit(data) {
    const image = typeof data.image === 'string' ? data.image : data.image[0];

    if (isEditSession)
      updateCabin(
        { newCabinData: { ...data, image }, id: updateId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        },
      );
    else
      createCabin(
        { ...data, image: image },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        },
      );
  }

  // function onError(errors) {
  //   console.log(errors);
  // }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} type={onCloseModal ? 'modal' : 'regular'}>
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register('name', {
            required: 'Please enter a cabin name',
          })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register('maxCapacity', {
            required: 'Please enter the maximum capacity',
            min: {
              value: 1,
              message: 'Capacity must be at least 1',
            },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register('regularPrice', {
            required: 'Please enter the regular price',
            min: {
              value: 1,
              message: 'Price must be at least 1',
            },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isWorking}
          {...register('discount', {
            required: 'Please enter the discount',
            max: {
              value: getValues().regularPrice,
              message: 'Discount should be less than the regular price',
            },
          })}
          defaultValue={0}
        />
      </FormRow>

      <FormRow label="Description" error={errors?.description?.message}>
        <Textarea
          type="number"
          id="description"
          disabled={isWorking}
          {...register('description', {
            required: 'Please enter a description',
          })}
          defaultValue=""
        />
      </FormRow>

      <FormRow label="Cabin photo">
        <FileInput
          id="image"
          accept="image/*"
          disabled={isWorking}
          {...register('image', {
            required: isEditSession ? false : 'Please upload a cabin photo',
          })}
        />
      </FormRow>

      <FormRow label="Cancel or Submit" className="screen-reader-only">
        <>
          {/* type is an HTML attribute! */}
          <Button variation="secondary" type="reset" onClick={() => onCloseModal?.()}>
            Cancel
          </Button>
          <Button disabled={isWorking}>{isEditSession ? 'Save Changes' : 'Create New Cabin'}</Button>
        </>
      </FormRow>
    </Form>
  );
}

CreateCabinForm.propTypes = {
  onCloseModal: PropTypes.func,
  cabinToUpdate: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    maxCapacity: PropTypes.number,
    regularPrice: PropTypes.number,
    discount: PropTypes.number,
    description: PropTypes.string,
    image: PropTypes.string,
  }),
};

export default CreateCabinForm;
