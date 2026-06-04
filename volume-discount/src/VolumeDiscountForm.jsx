import React, { useCallback } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import {
  Page,
  Layout,
  Card,
  FormLayout,
  TextField,
  Select,
  Button,
  InlineStack,
  BlockStack,
  Text,
  Badge,
  Divider,
  Banner,
  DataTable,
  Icon,
} from '@shopify/polaris'
import { DeleteIcon, PlusCircleIcon } from '@shopify/polaris-icons'
import './VolumeDiscountForm.css'

const DISCOUNT_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: '% discount', value: 'percent' },
  { label: 'Discount / each', value: 'fixed' },
]

const DEFAULT_OPTION = (quantity = 1) => ({
  title: '',
  subtitle: '',
  label: '',
  quantity: String(quantity),
  discountType: 'none',
  amount: '',
})

const mockSaveApi = async (data) => {
  await new Promise((r) => setTimeout(r, 800))
  console.log('Saved:', data)
  return { success: true }
}

export default function VolumeDiscountForm() {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      campaign: '',
      title: '',
      description: '',
      options: [
        { title: 'Single', subtitle: 'Standard price', label: '', quantity: '1', discountType: 'none', amount: '' },
        { title: 'Duo', subtitle: 'Save 10%', label: 'Popular', quantity: '2', discountType: 'percent', amount: '10' },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
    rules: { minLength: { value: 1, message: 'At least 1 option is required' } },
  })

  const watchedValues = watch()

  const onSubmit = useCallback(async (data) => {
    await mockSaveApi(data)
  }, [])

  const addOption = useCallback(() => {
    append(DEFAULT_OPTION(1))
  }, [append])

  const previewRows = watchedValues.options.map((opt) => {
    const discountLabel =
      opt.discountType === 'none' ? 'None'
      : opt.discountType === 'percent' ? '%discount'
      : 'Discount/each'

    const amountCell =
      opt.discountType === 'none' ? ''
      : opt.discountType === 'percent' ? `${opt.amount || 0} %`
      : `$ ${opt.amount || 0}`

    return [opt.title || '—', discountLabel, opt.quantity || '—', amountCell]
  })

  return (
    <div className="vd-page-bg">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Page
          backAction={{ content: 'Back', url: '#' }}
          title="Create volume discount"
          primaryAction={
            <Button submit variant="primary" loading={isSubmitting}>
              Save
            </Button>
          }
        >
          {isSubmitSuccessful && (
            <div style={{ marginBottom: '16px' }}>
              <Banner tone="success" title="Saved successfully!" />
            </div>
          )}

          <Layout>
            {/* ── Left column ── */}
            <Layout.Section>
              <BlockStack gap="400">
                {/* General */}
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">General</Text>
                    <FormLayout>
                      <Controller
                        name="campaign"
                        control={control}
                        rules={{ required: 'Campaign name is required' }}
                        render={({ field }) => (
                          <TextField
                            label="Campaign"
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.campaign?.message}
                            autoComplete="off"
                          />
                        )}
                      />
                      <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            label="Title"
                            value={field.value}
                            onChange={field.onChange}
                            autoComplete="off"
                          />
                        )}
                      />
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            label="Description"
                            value={field.value}
                            onChange={field.onChange}
                            autoComplete="off"
                          />
                        )}
                      />
                    </FormLayout>
                  </BlockStack>
                </Card>

                {/* Volume discount rule */}
                <Card>
                  <BlockStack gap="500">
                    <Text variant="headingMd" as="h2">Volume discount rule</Text>

                    {errors.options?.root && (
                      <Banner tone="critical">{errors.options.root.message}</Banner>
                    )}

                    {fields.map((field, index) => (
                      <OptionCard
                        key={field.id}
                        index={index}
                        control={control}
                        watch={watch}
                        errors={errors}
                        onRemove={() => remove(index)}
                        canRemove={fields.length > 1}
                      />
                    ))}

                    <Button
                      onClick={addOption}
                      variant="primary"
                      tone="critical"
                      fullWidth
                      icon={PlusCircleIcon}
                    >
                      Add option
                    </Button>
                  </BlockStack>
                </Card>
              </BlockStack>
            </Layout.Section>

            {/* ── Right column: Preview ── */}
            <Layout.Section variant="oneThird">
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">Preview</Text>
                  <BlockStack gap="200">
                    <Text variant="headingLg" as="h3" alignment="center" fontWeight="bold">
                      {watchedValues.title || 'Buy more and save'}
                    </Text>
                    <Text variant="bodyMd" as="p">
                      {watchedValues.description || ''}
                    </Text>
                  </BlockStack>
                  <DataTable
                    columnContentTypes={['text', 'text', 'text', 'text']}
                    headings={['Title', 'Discount Type', 'Quantity', 'Amount']}
                    rows={previewRows}
                  />
                </BlockStack>
              </Card>
            </Layout.Section>
          </Layout>
        </Page>
      </form>
    </div>
  )
}

function OptionCard({ index, control, watch, errors, onRemove, canRemove }) {
  const discountType = watch(`options.${index}.discountType`)
  const hasAmount = discountType === 'percent' || discountType === 'fixed'
  const amountSuffix = discountType === 'percent' ? '%' : '$'

  return (
    <div className="vd-option-card">
      <div className="vd-option-header">
        <span className="vd-option-badge">OPTION {index + 1}</span>
        {canRemove && (
          <button type="button" className="vd-delete-btn" onClick={onRemove} title="Remove option">
            <Icon source={DeleteIcon} />
          </button>
        )}
      </div>

      <BlockStack gap="300">
        {/* Row 1: Title | Subtitle | Label */}
        <div className="vd-grid-3">
          <Controller
            name={`options.${index}.title`}
            control={control}
            rules={{ required: 'Title is required' }}
            render={({ field }) => (
              <TextField
                label="Title"
                value={field.value}
                onChange={field.onChange}
                error={errors.options?.[index]?.title?.message}
                autoComplete="off"
              />
            )}
          />
          <Controller
            name={`options.${index}.subtitle`}
            control={control}
            render={({ field }) => (
              <TextField
                label="Subtitle"
                value={field.value}
                onChange={field.onChange}
                autoComplete="off"
              />
            )}
          />
          <Controller
            name={`options.${index}.label`}
            control={control}
            render={({ field }) => (
              <TextField
                label="Label (optional)"
                value={field.value}
                onChange={field.onChange}
                autoComplete="off"
              />
            )}
          />
        </div>

        {/* Row 2: Quantity | Discount type | Amount (conditional) */}
        <div className={`vd-grid-${hasAmount ? '3' : '2'}`}>
          <Controller
            name={`options.${index}.quantity`}
            control={control}
            rules={{
              required: 'Required',
              pattern: { value: /^\d+(\.\d+)?$/, message: 'Must be a number' },
            }}
            render={({ field }) => (
              <TextField
                label="Quantity"
                value={field.value}
                onChange={field.onChange}
                error={errors.options?.[index]?.quantity?.message}
                autoComplete="off"
                type="number"
              />
            )}
          />
          <Controller
            name={`options.${index}.discountType`}
            control={control}
            render={({ field }) => (
              <Select
                label="Discount type"
                options={DISCOUNT_OPTIONS}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {hasAmount && (
            <Controller
              name={`options.${index}.amount`}
              control={control}
              rules={{
                required: 'Required',
                pattern: { value: /^\d+(\.\d+)?$/, message: 'Must be a number' },
              }}
              render={({ field }) => (
                <TextField
                  label="Amount"
                  value={field.value}
                  onChange={field.onChange}
                  suffix={amountSuffix}
                  error={errors.options?.[index]?.amount?.message}
                  autoComplete="off"
                  type="number"
                />
              )}
            />
          )}
        </div>
      </BlockStack>
    </div>
  )
}
