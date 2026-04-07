import { FormikConfig } from 'formik'

export interface ModalFormikProps<T = object> {
	open: boolean
	onClose: () => void
	onSubmit: FormikConfig<T>['onSubmit']
	initialValues: T
	isLoading?: (prop: string) => boolean
}
