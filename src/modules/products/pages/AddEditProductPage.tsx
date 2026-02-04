import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createProduct, updateProduct, getProductById } from '@/http/Services/all';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { showError, showSuccess } from '@/utility/utility';
import { useParams, useNavigate } from 'react-router';
import { format } from 'date-fns';
import { Eye, EyeOff } from 'lucide-react';

const AddEditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [phoneValue, setPhoneValue] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');

  const {data: productData, isLoading, isError, error }: any = useQuery({
    queryKey: ['productData', id],
    queryFn: () => getProductById(id || ''),
    enabled: !!id,
  });
  
  if (isError) {
    showError(error?.response?.data?.message);
  }

  const productDetail = productData?.data;

  const form = useForm({
    defaultValues: {
      name: productDetail?.name ?? '',
      email: productDetail?.email ?? '',
      username: productDetail?.username ?? '',
      password: '',
      gender: productDetail?.gender ?? 'male',
      phone_number: productDetail?.phone_number ?? '',
      date_of_birth: productDetail?.date_of_birth ?? '',
      age: productDetail?.age ?? (null as number | null),
      forms: productDetail?.forms ?? (null as number | null),
      profile_pic: productDetail?.profile_pic ?? null,
      shule_name: productDetail?.shule_name ?? '',
    },
    onSubmit: async ({ value }) => {
      setIsFormSubmitted(true);
      const payload: any = {
        ...value,
        date_of_birth: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : value.date_of_birth,
        phone_number: phoneValue || value.phone_number,
      };
      
      // Remove password from payload if it's empty in edit mode
      if (isEditMode && !payload.password) {
        delete payload.password;
      }
      
      if (isEditMode && id) {
        mutation.mutate({ id, payload });
      } else {
        mutation.mutate({ id: null, payload });
      }
    },
  });

  useEffect(() => {
    if (id && productDetail) {
      form.setFieldValue('name', productDetail?.name ?? '');
      form.setFieldValue('email', productDetail?.email ?? '');
      form.setFieldValue('username', productDetail?.username ?? '');
      form.setFieldValue('gender', productDetail?.gender ?? 'male');
      form.setFieldValue('phone_number', productDetail?.phone_number ?? '');
      form.setFieldValue('date_of_birth', productDetail?.date_of_birth ?? '');
      form.setFieldValue('age', productDetail?.age ?? null);
      form.setFieldValue('profile_pic', productDetail?.profile_pic ?? null);
      form.setFieldValue('shule_name', productDetail?.shule_name ?? '');
      // form.setFieldValue('forms', productDetail?.forms ?? null);

      if (productDetail?.forms) {
        form.setFieldValue('forms', Number(productDetail.forms));
      }

      debugger
      // Set phone value
      if (productDetail?.phone_number) {
        setPhoneValue(productDetail.phone_number);
      }

      // Set date value
      if (productDetail?.date_of_birth) {
        const date = new Date(productDetail.date_of_birth);
        setSelectedDate(date);
      }

      // Set profile image URL
      if (productDetail?.profile_pic) {
        setProfileImageUrl(productDetail.profile_pic);
      }
    }
  }, [form, id, productDetail]);

  const mutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: any }) => {
      if (id) {
        return updateProduct(id, payload);
      }
      return createProduct(payload);
    },
    onSuccess: (data) => {
      showSuccess(isEditMode ? 'Product updated successfully' : 'Product created successfully');
      setIsFormSubmitted(false);
      navigate('/products');
    },
    onError: (error: any) => {
      console.log('error: ', error);
      showError(error?.response?.data?.message || 'An error occurred');
      setIsFormSubmitted(false);
    },
  });

  const formOptions = [
    { id: 1, label: 'Form 1' },
    { id: 2, label: 'Form 2' },
    { id: 3, label: 'Form 3' },
    { id: 4, label: 'Form 4' },
  ];

  if (isLoading && isEditMode) {
    return <div>Loading...</div>;
  }

  return (
    <>
     <div className="w-full space-y-6 p-6">
      <section className="relative w-full rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300">
        <header className="space-y-1.5 pb-4">
          <h2 className="text-base font-semibold text-[#111B33]">
            {isEditMode ? 'Edit Product' : 'Add Product'}
          </h2>
          <p className="text-sm text-[#5E6A85]">Make sure all the fields entered are correct!</p>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <FieldGroup>
            {/* Profile Picture Upload Section - At the Top */}
            <div className="space-y-2">
              <form.Field
                validators={{
                  onChange: z.string().url('Invalid URL').optional().or(z.literal('')),
                }}
                name="profile_pic"
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && field.state.meta.errors.length > 0;
                  const firstError = field.state.meta.errors[0];
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="profile_pic">Profile Picture</FieldLabel>
                      <div className="flex items-center gap-4">
                        <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-gray-200">
                          <img
                            src={field.state.value || profileImageUrl || 'https://via.placeholder.com/150'}
                            alt="Profile"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                            }}
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => {
                              const url = prompt('Enter image URL:');
                              if (url) {
                                field.handleChange(url);
                                setProfileImageUrl(url);
                              }
                            }}
                          >
                            Upload Image
                          </Button>
                        </div>
                      </div>
                      {isInvalid && firstError && (
                        <FieldError
                          errors={[typeof firstError === 'string' ? { message: firstError } : firstError]}
                        />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </div>

            {/* Row 1: Name and Username */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <form.Field
                  validators={{
                    onChange: z
                      .string()
                      .min(1, 'Name is required')
                      .max(100, 'Maximum 100 characters are allowed')
                      .trim(),
                  }}
                  name="name"
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && field.state.meta.errors.length > 0;
                    const firstError = field.state.meta.errors[0];
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="name">Name</FieldLabel>
                        <Input
                          id="name"
                          placeholder="Enter name"
                          value={field.state.value ?? ''}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && firstError && (
                          <FieldError
                            errors={[typeof firstError === 'string' ? { message: firstError } : firstError]}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <div className="space-y-2">
                <form.Field
                  validators={{
                    onChange: z
                      .string()
                      .min(1, 'Username is required')
                      .max(50, 'Maximum 50 characters are allowed')
                      .trim(),
                  }}
                  name="username"
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && field.state.meta.errors.length > 0;
                    const firstError = field.state.meta.errors[0];
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="username">Username</FieldLabel>
                        <Input
                          id="username"
                          placeholder="Enter username"
                          value={field.state.value ?? ''}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                          disabled={isEditMode}
                        />
                        {isInvalid && firstError && (
                          <FieldError
                            errors={[typeof firstError === 'string' ? { message: firstError } : firstError]}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </div>

            {/* Row 2: Email and Phone Number */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <form.Field
                  validators={{
                    onChange: z
                      .string()
                      .min(1, 'Email is required')
                      .email('Invalid email address')
                      .trim(),
                  }}
                  name="email"
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && field.state.meta.errors.length > 0;
                    const firstError = field.state.meta.errors[0];
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter email"
                          value={field.state.value ?? ''}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                          disabled={isEditMode}
                        />
                        {isInvalid && firstError && (
                          <FieldError
                            errors={[typeof firstError === 'string' ? { message: firstError } : firstError]}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <div className="space-y-2">
                <form.Field
                  validators={{
                    onChange: z.string().min(1, 'Phone number is required'),
                  }}
                  name="phone_number"
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && field.state.meta.errors.length > 0;
                    const firstError = field.state.meta.errors[0];
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="phone_number">Phone Number</FieldLabel>
                        <PhoneInput
                          international
                          defaultCountry="US"
                          countryCallingCodeEditable={false}
                          value={phoneValue || field.state.value}
                          onChange={(value) => {
                            setPhoneValue(value || '');
                            field.handleChange(value || '');
                          }}
                          onBlur={field.handleBlur}
                          className={cn(
                            'flex rounded-md border border-input bg-background',
                            isInvalid && 'border-destructive'
                          )}
                          numberInputProps={{
                            className: cn(
                              'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 h-9 w-full min-w-0 border-0 bg-transparent px-3 py-1 text-base shadow-none transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                              'focus-visible:ring-0'
                            )
                          }}
                          countrySelectProps={{
                            className: 'mr-2 border-0 bg-transparent focus:ring-0',
                            searchable: true,
                            searchPlaceholder: 'Search country...',
                          }}
                        />
                        {isInvalid && firstError && (
                          <FieldError
                            errors={[typeof firstError === 'string' ? { message: firstError } : firstError]}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </div>

            {/* Row 3: Password and Gender */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <form.Field
                  validators={{
                    onChange: isEditMode
                      ? z.string().min(6, 'Password must be 6-12 characters').max(12, 'Password must be 6-12 characters').optional().or(z.literal(''))
                      : z
                          .string()
                          .min(1, 'Password is required')
                          .min(6, 'Password must be 6-12 characters')
                          .max(12, 'Password must be 6-12 characters')
                          .trim(),
                  }}
                  name="password"
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && field.state.meta.errors.length > 0;
                    const firstError = field.state.meta.errors[0];
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            value={field.state.value ?? ''}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            aria-invalid={isInvalid}
                            className="pr-10"
                            maxLength={12}
                            disabled={isEditMode}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {isInvalid && firstError && (
                          <FieldError
                            errors={[typeof firstError === 'string' ? { message: firstError } : firstError]}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <div className="space-y-2">
                <form.Field
                  validators={{
                    onChange: z.enum(['male', 'female', 'other'], {
                      errorMap: () => ({ message: 'Gender is required' }),
                    }),
                  }}
                  name="gender"
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && field.state.meta.errors.length > 0;
                    const firstError = field.state.meta.errors[0];
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel>Gender</FieldLabel>
                        <RadioGroup
                          value={field.state.value ?? 'male'}
                          onValueChange={(value) => field.handleChange(value as 'male' | 'female' | 'other')}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <label htmlFor="male" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Male
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <label htmlFor="female" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Female
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <label htmlFor="other" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Other
                            </label>
                          </div>
                        </RadioGroup>
                        {isInvalid && firstError && (
                          <FieldError
                            errors={[typeof firstError === 'string' ? { message: firstError } : firstError]}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </div>

            {/* Row 4: School Name and Form/Class */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <form.Field
                  validators={{
                    onChange: z
                      .string()
                      .min(1, 'School name is required')
                      .max(100, 'Maximum 100 characters are allowed')
                      .trim(),
                  }}
                  name="shule_name"
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && field.state.meta.errors.length > 0;
                    const firstError = field.state.meta.errors[0];
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="shule_name">School Name</FieldLabel>
                        <Input
                          id="shule_name"
                          placeholder="Enter school name"
                          value={field.state.value ?? ''}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && firstError && (
                          <FieldError
                            errors={[typeof firstError === 'string' ? { message: firstError } : firstError]}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <div className="space-y-2">
                <form.Field
                  validators={{
                    onSubmit: z
                      .number()
                      .nullable()
                      .refine((val) => val !== null, {
                        message: 'Form is required',
                      }),
                  }}
                  name="forms"
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 &&
                      field.state.meta.errorMap;
                    const firstError = field.state.meta.errors[0];
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          className={cn({
                            'text-destructive': isInvalid,
                          })}
                          htmlFor="forms"
                        >
                          Form/Class
                        </FieldLabel>
                        <Select
                            key={field.state.value}
                            defaultValue={field.state.value ? String(field.state.value) : ''}
                            onValueChange={(value) => field.handleChange(Number(value))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select form" />
                            </SelectTrigger>
                            <SelectContent>
                              {formOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id.toString()}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                        {isInvalid && firstError && (
                          <FieldError
                            errors={[typeof firstError === 'string' ? { message: firstError } : firstError]}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </div>

            {/* Row 5: Age and Date of Birth */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <form.Field
                  validators={{
                    onChange: z
                      .number()
                      .int('Age must be a whole number')
                      .positive('Age must be a positive number')
                      .min(1, 'Age must be at least 1')
                      .max(99, 'Age must not exceed 99'),
                  }}
                  name="age"
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && field.state.meta.errors.length > 0;
                    const firstError = field.state.meta.errors[0];
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="age">Age</FieldLabel>
                        <Input
                          id="age"
                          type="number"
                          placeholder="Enter age"
                          value={field.state.value ?? ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || /^\d+$/.test(value)) {
                              const numValue = parseInt(value, 10);
                              if (value === '' || numValue <= 99) {
                                field.handleChange(value === '' ? null : numValue);
                              }
                            }
                          }}
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          max={99}
                        />
                        {isInvalid && firstError && (
                          <FieldError
                            errors={[typeof firstError === 'string' ? { message: firstError } : firstError]}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <div className="space-y-2">
                <form.Field
                  validators={{
                    onChange: z.string().min(1, 'Date of birth is required'),
                  }}
                  name="date_of_birth"
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && field.state.meta.errors.length > 0;
                    const firstError = field.state.meta.errors[0];
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="date_of_birth">Date of Birth</FieldLabel>
                        <DatePicker
                          value={selectedDate}
                          onChange={(date) => {
                            setSelectedDate(date);
                            if (date) {
                              field.handleChange(format(date, 'yyyy-MM-dd'));
                            } else {
                              field.handleChange('');
                            }
                          }}
                          placeholder="Select date of birth"
                          className={cn(isInvalid && 'border-destructive')}
                        />
                        {isInvalid && firstError && (
                          <FieldError
                            errors={[typeof firstError === 'string' ? { message: firstError } : firstError]}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button type="submit" disabled={isFormSubmitted} className="bg-[#8B1A1A] text-white hover:bg-[#7A1515] px-4 py-2"> {isEditMode ? 'Update Product' : 'Create Product'} </Button>
            </div>
          </FieldGroup>
        </form>
      </section>
     </div>
    </>
  );
};

export default AddEditProductPage;
