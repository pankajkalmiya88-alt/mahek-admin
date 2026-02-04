import { useEffect, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  genrateSeoPage,
  getCityBasedOnCondition,
  getSeoPageData,
  getSeoSettings,
} from '@/http/Services/all';
import { useMutation, useQuery } from '@tanstack/react-query';
import SearchableSelect from '@/shared-component/SearchableSelect';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import { base64Encode, showError, showSuccess } from '@/utility/utility';
import { useSearchParams } from 'react-router';

export interface ServiceItem {
  service_id: number;
  service_name: string;
}

export interface IndustryItem {
  domain_id: number;
  domain: string;
}

export interface CountryItem {
  country_id: number;
  country: string;
  cities?: CityItem[];
}

export interface CityItem {
  city_id: number;
  city: string;
}

const serviceTypes = [
  {
    key: 'service',
    title: 'By Service',
    description: 'Focus on service categories',
  },
  {
    key: 'industry',
    title: 'By Industry',
    description: 'Focus on industry verticals',
  },
];

const GenerateSeoPageForm = ({ processState, onProcessChange }: any) => {
  const [mode, setMode] = useState<'service' | 'industry'>('service');
  const [selectedService, setSelectedService] = useState<string | number | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | number | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | number | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = new URLSearchParams(searchParams);
  const id = searchParams.get('pageId');

  const { data } = useQuery({
    queryKey: ['seoSettings'],
    queryFn: getSeoSettings,
  });

  const {
    data: seoPageData,
    isLoading,
    isError,
    error,
  }: any = useQuery({
    queryKey: ['seoPageData', id],
    queryFn: () => getSeoPageData(id || ''),
    enabled: !!id,
  });

  if (isError) {
    showError(error?.response?.data?.message);
    // onProcessChange({
    //     isProcess: false,
    //     data: null,
    //   });
    //   return
  }

  const seoPageDetail = seoPageData?.data?.data;

  const form = useForm({
    defaultValues: {
      page_type: seoPageDetail?.page_type ?? mode,
      project_title: seoPageDetail?.project_title ?? '',
      service_id: seoPageDetail?.service_id ?? (null as number | null),
      industry_id: seoPageDetail?.domain_id ?? (null as number | null),
      location: seoPageDetail?.location ?? '',
      city_id: seoPageDetail?.city_id ?? (null as number | null),
      state_id: seoPageDetail?.state_id ?? (null as number | null),
      country_id: seoPageDetail?.country_id ?? (null as number | null),
      meta_title: seoPageDetail?.meta_title ?? '',
      meta_description: seoPageDetail?.meta_description ?? '',
    },
    onSubmit: async ({ value }) => {
      setIsFormSubmitted(true);
      const location = cityOptions.find((item: any) => item.id === value?.city_id)?.label;
      mutation.mutate({ ...value, location });
    },
  });

  const { country = [], service: services = [], industry: industrys = [] } = data?.data?.data || {};

  const serviceOptions = services.map((item: ServiceItem) => ({
    id: item.service_id,
    label: item.service_name,
  }));

  const industryOptions = industrys.map((item: IndustryItem) => ({
    id: item.domain_id,
    label: item.domain,
  }));

  const countryOptions = country.map((item: CountryItem) => ({
    id: item.country_id,
    label: item.country,
  }));

  // Get current values for API call (using state variables and form mode)
  const currentServiceId = selectedService;
  const currentCountryId = selectedCountry;
  const currentPageType = mode;

  // Check if all three required values are present
  const allConditionsMet =
    currentServiceId != null &&
    currentCountryId != null &&
    currentPageType != null
    // currentPageType !== ''

  // Build query string for the API call
  const buildQueryString = () => {
    if (!allConditionsMet) return '';
    const params = new URLSearchParams();
    params.append('service_id', String(currentServiceId));
    params.append('country_id', String(currentCountryId));
    params.append('page_type', String(currentPageType));
    return `?${params.toString()}`;
  };

  // Call API when all conditions are met
  const { data: cityData, isLoading: isLoadingCities } = useQuery({
    queryKey: ['cityBasedOnCondition', currentServiceId, currentCountryId, currentPageType],
    queryFn: () => getCityBasedOnCondition(buildQueryString()),
    enabled: allConditionsMet,
  });

  // Get cities from API response based on selectedCountry
  const apiCountries = cityData?.data?.data?.country || [];
  const selectedCountryDataFromAPI = apiCountries.find(
    (item: CountryItem) => item.country_id === selectedCountry,
  );

  // Use API cities if available, otherwise fall back to original data
  const cityOptions = (selectedCountryDataFromAPI?.cities || []).map((item: CityItem) => ({
    id: item.city_id,
    label: item.city,
  }));

  useEffect(() => {
    form.setFieldValue('page_type', mode);
    // Clear industry_id when switching to 'service' mode
    if (mode === 'service') {
      form.setFieldValue('industry_id', null);
      setSelectedIndustry(null);
    }
  }, [mode, form]);

  // Track if initial data has been loaded to avoid clearing city unnecessarily
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const hasSetInitialCity = useRef(false);

  useEffect(() => {
    form.setFieldValue('service_id', selectedService as number | null);
    // Clear city when service changes (but not on initial load)
    if (!isInitialLoad) {
      setSelectedCity(null);
      form.setFieldValue('city_id', null);
    }
  }, [selectedService, form, isInitialLoad]);

  useEffect(() => {
    form.setFieldValue('industry_id', selectedIndustry as number | null);
  }, [selectedIndustry, form]);

  useEffect(() => {
    if (id && seoPageDetail) return;
    form.setFieldValue('country_id', selectedCountry as number | null);
    // Clear city when country changes (but not on initial load)
    if (!isInitialLoad) {
      setSelectedCity(null);
      form.setFieldValue('city_id', null);
      form.setFieldValue('state_id', null);
    }
  }, [selectedCountry, form, id, seoPageDetail, isInitialLoad]);

  // Clear city when page_type (mode) changes (but not on initial load)
  useEffect(() => {
    if (!isInitialLoad) {
      setSelectedCity(null);
      form.setFieldValue('city_id', null);
    }
  }, [mode, form, isInitialLoad]);

  useEffect(() => {
    form.setFieldValue('city_id', selectedCity as number | null);
  }, [selectedCity, form]);

  useEffect(() => {
    if (!id && !seoPageDetail) return;

    hasSetInitialCity.current = false;

    // Set mode based on page_type
    const pageType = seoPageDetail?.page_type;
    setMode(pageType === 'industry' ? 'industry' : 'service');

    setSelectedCountry(seoPageDetail?.country_id);
    setSelectedService(seoPageDetail?.service_id);
    setSelectedIndustry(seoPageDetail?.industry_id);

    form.setFieldValue('location', seoPageDetail?.location);
    form.setFieldValue('country_id', seoPageDetail?.country_id);
    form.setFieldValue('service_id', seoPageDetail?.service_id);
    form.setFieldValue('industry_id', seoPageDetail?.industry_id);
    form.setFieldValue('meta_title', seoPageDetail?.meta_title);
    form.setFieldValue('meta_description', seoPageDetail?.meta_description);
    form.setFieldValue('page_type', pageType ?? (pageType === 'industry' ? 'industry' : 'service'));
    form.setFieldValue('project_title', seoPageDetail?.project_title);

    // Mark initial load as complete after setting values
    setIsInitialLoad(false);

    // Patch Data
    onProcessChange({
      isProcess: true,
      data: seoPageDetail,
    });
  }, [form, id, seoPageDetail]);

  useEffect(() => {
    if (!id || !seoPageDetail?.city_id) return;
    if (cityOptions.length === 0) return;
    if (hasSetInitialCity.current) return;

    const cityExists = cityOptions.some((city: any) => city.id === seoPageDetail.city_id);
    if (cityExists && selectedCity !== seoPageDetail.city_id) {
      setSelectedCity(seoPageDetail.city_id);
      form.setFieldValue('city_id', seoPageDetail.city_id);
      hasSetInitialCity.current = true;
    }
  }, [cityOptions, seoPageDetail, id, selectedCity, form]);

  // Mark initial load as complete after a short delay if no seoPageDetail
  useEffect(() => {
    if (!id && !seoPageDetail) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [id, seoPageDetail]);

  // mutation
  const mutation = useMutation({
    mutationFn: genrateSeoPage,
    onSuccess: (data) => {
      onProcessChange({
        isProcess: true, // PROCESS START
        data: data?.data?.data,
      });
      showSuccess('Please wait, page generation in progress...');
      params.set('pageId', base64Encode(data?.data?.data?.seo_page_id));
      setSearchParams(params);
    },

    onError: (error: any) => {
      console.log('error: ', error);
      showError(error?.response?.data?.message);
      onProcessChange({ isProcess: false });
      setIsFormSubmitted(false);
    },
  });

  return (
    <>
      {isLoading && <div>loading...</div>}
      {!isLoading && (
        <section
          className={
            `relative w-full rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 ` +
            (processState.isProcess || isFormSubmitted || !!id
              ? 'opacity-40 pointer-events-none select-none'
              : '')
          }
        >
          <header className="space-y-1.5 pb-4">
            <h2 className="text-base font-semibold text-[#111B33]">Page Generation Form</h2>
            <p className="text-sm text-[#5E6A85]">Make sure all the fields entered are correct!</p>
          </header>

          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            {serviceTypes.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setMode(option.key as 'service' | 'industry')}
                className={cn(
                  'rounded-[0.625rem] border p-3 cursor-pointer text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#336DFF]/30',
                  mode === option.key
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-[#CBD5F0]',
                )}
              >
                <div className="h-[16px] w-[16px] p-1.5 bg-white flex justify-center items-center rounded-full border border-gray-300">
                  <span
                    className={cn(
                      'w-2 h-2 flex shrink-0 justify-center items-center rounded-full',
                      mode === option.key ? 'bg-blue-400' : 'bg-white',
                    )}
                  />
                </div>
                <div className="mt-6 flex flex-col gap-1.5">
                  <p className="text-sm font-semibold text-[#111B33]">{option.title}</p>
                  <p className="text-sm text-[#737373]">{option.description}</p>
                </div>
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <FieldGroup>
              <div className="space-y-2">
                <form.Field
                  validators={{
                    onChange: z
                      .string()
                      .min(1, 'Project title is required')
                      .max(100, 'Maximum 100 characters are allowed')
                      .trim(),
                  }}
                  name="project_title"
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && field.state.meta.errors.length > 0;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="project-title">Project Title</FieldLabel>
                        <Input
                          id="project-title"
                          placeholder="Top 10 App Development Companies"
                          value={field.state.value ?? ''}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError
                            errors={field.state.meta.errors.map((err) =>
                              typeof err === 'string' ? { message: err } : err,
                            )}
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
                        message: 'Service is required',
                      }),
                  }}
                  name="service_id"
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 &&
                      field.state.meta.errorMap;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          className={cn({
                            'text-destructive': isInvalid,
                          })}
                          htmlFor="services"
                        >
                          Services
                        </FieldLabel>
                        <SearchableSelect
                          inputClassName={cn({
                            'border-destructive': isInvalid,
                            'text-muted-foreground': !selectedService,
                          })}
                          options={serviceOptions}
                          placeholder="Select Service"
                          value={selectedService}
                          onChange={(value) => {
                            setSelectedService(value);
                            field.handleChange(value as number | null);
                          }}
                        />
                        {isInvalid && (
                          <FieldError
                            errors={field.state.meta.errors.map((err) =>
                              typeof err === 'string' ? { message: err } : err,
                            )}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <div
                className="space-y-2"
                style={{ display: mode === 'industry' ? 'block' : 'none' }}
              >
                <form.Field
                  validators={
                    mode === 'industry'
                      ? {
                          onSubmit: z
                            .number()
                            .nullable()
                            .refine((val) => val !== null, {
                              message: 'Industry is required',
                            }),
                        }
                      : undefined
                  }
                  name="industry_id"
                >
                  {(field) => {
                    if (mode !== 'industry') return null;
                    const isInvalid =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 &&
                      field.state.meta.errorMap;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          className={cn({
                            'text-destructive': isInvalid,
                          })}
                          htmlFor="industrys"
                        >
                          Industry
                        </FieldLabel>
                        <SearchableSelect
                          inputClassName={cn({
                            'border-destructive': isInvalid,
                            'text-muted-foreground': !selectedIndustry,
                          })}
                          options={industryOptions}
                          placeholder="Select Industry"
                          value={selectedIndustry}
                          onChange={(value) => {
                            setSelectedIndustry(value);
                            field.handleChange(value as number | null);
                          }}
                        />
                        {isInvalid && (
                          <FieldError
                            errors={field.state.meta.errors.map((err) =>
                              typeof err === 'string' ? { message: err } : err,
                            )}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <form.Field
                    validators={{
                      onSubmit: z
                        .number()
                        .nullable()
                        .refine((val) => val !== null, {
                          message: 'Country is required',
                        }),
                    }}
                    name="country_id"
                  >
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 &&
                        field.state.meta.errorMap;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel
                            className={cn({
                              'text-destructive': isInvalid,
                            })}
                            htmlFor="country"
                          >
                            Country
                          </FieldLabel>
                          <SearchableSelect
                            inputClassName={cn({
                              'border-destructive': isInvalid,
                              'text-muted-foreground': !selectedCountry,
                            })}
                            placeholder="Select Country"
                            options={countryOptions}
                            value={selectedCountry}
                            onChange={(value) => {
                              setSelectedCountry(value);
                              field.handleChange(value as number | null);
                            }}
                          />
                          {isInvalid && (
                            <FieldError
                              errors={field.state.meta.errors.map((err) =>
                                typeof err === 'string' ? { message: err } : err,
                              )}
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
                          message: 'City is required',
                        }),
                    }}
                    name="city_id"
                  >
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 &&
                        field.state.meta.errorMap;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel
                            className={cn({
                              'text-destructive': isInvalid,
                            })}
                            htmlFor="city"
                          >
                            City
                          </FieldLabel>
                          <SearchableSelect
                            inputClassName={cn({
                              'border-destructive': isInvalid,
                              'text-muted-foreground': !selectedCity,
                            })}
                            placeholder={
                              isLoadingCities && allConditionsMet
                                ? 'Loading cities...'
                                : cityOptions.length === 0 && allConditionsMet
                                  ? 'No cities available'
                                  : 'Select City'
                            }
                            options={cityOptions}
                            value={selectedCity}
                            onChange={(value) => {
                              setSelectedCity(value);
                              field.handleChange(value as number | null);
                            }}
                            disabled={isLoadingCities && allConditionsMet}
                          />
                          {isInvalid && (
                            <FieldError
                              errors={field.state.meta.errors.map((err) =>
                                typeof err === 'string' ? { message: err } : err,
                              )}
                            />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </div>
              </div>

              <div className="space-y-2">
                <form.Field
                  validators={{
                    onChange: z
                      .string()
                      .min(1, 'Meta title is required')
                      .max(100, 'Maximum 100 characters are allowed')
                      .trim(),
                  }}
                  name="meta_title"
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && field.state.meta.errors.length > 0;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="meta-title">Meta Title</FieldLabel>
                        <Input
                          id="meta-title"
                          placeholder="Top 10 App Development Companies | New York"
                          value={field.state.value ?? ''}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError
                            errors={field.state.meta.errors.map((err) =>
                              typeof err === 'string' ? { message: err } : err,
                            )}
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
                      .min(1, 'Meta description is required')
                      .max(160, 'Maximum 160 characters are allowed')
                      .trim(),
                  }}
                  name="meta_description"
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && field.state.meta.errors.length > 0;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="meta-description">Meta Description</FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea
                            className={cn(
                              {
                                'border-destructive': isInvalid,
                              },
                              'focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-offset-0 focus:border-transparent focus-visible:border-transparent',
                            )}
                            id="meta-description"
                            rows={3}
                            placeholder="Discover top-rated app development companies in New York..."
                            value={field.state.value ?? ''}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            aria-invalid={isInvalid}
                          />
                          <InputGroupAddon
                            className="focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-transparent focus-visible:border-transparent"
                            align="block-end"
                          >
                            <InputGroupText className="tabular-nums">
                              {field?.state?.value?.length ?? 0}/160 characters
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        {isInvalid && (
                          <FieldError
                            errors={field.state.meta.errors.map((err) =>
                              typeof err === 'string' ? { message: err } : err,
                            )}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-900 text-gray-900 hover:bg-[#EFF2FB] cursor-pointer"
                  onClick={() => {
                    form.reset();
                    setSelectedService(null);
                    setSelectedIndustry(null);
                    setSelectedCountry(null);
                    setSelectedCity(null);
                    setMode('service');
                  }}
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-400 text-white hover:bg-blue-700 text-sm font-medium cursor-pointer"
                >
                  Generate Page
                </Button>
              </div>
            </FieldGroup>
          </form>
        </section>
      )}
    </>
  );
};

export default GenerateSeoPageForm;
