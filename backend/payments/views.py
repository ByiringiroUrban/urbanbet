import uuid
from decimal import Decimal
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Transaction
from .serializers import DepositSerializer, WithdrawalSerializer, TransactionSerializer


def _generate_reference(prefix='TXN'):
    return f"{prefix}-{uuid.uuid4().hex[:12].upper()}"


class DepositView(generics.GenericAPIView):
    serializer_class = DepositSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        user = request.user
        reference = _generate_reference('DEP')

        txn = Transaction.objects.create(
            user=user,
            transaction_type=Transaction.TYPE_DEPOSIT,
            method=data['method'],
            amount=data['amount'],
            currency=data['currency'],
            status=Transaction.STATUS_COMPLETED,
            reference=reference,
            description=data.get('description', 'Deposit'),
            phone_number=data.get('phone_number', ''),
        )

        user.balance += Decimal(str(data['amount']))
        user.save(update_fields=['balance'])

        return Response({
            'success': True,
            'transaction_id': txn.id,
            'reference': reference,
            'message': f"Deposit of {data['currency']} {data['amount']:,} processed successfully.",
            'new_balance': str(user.balance),
        }, status=status.HTTP_201_CREATED)


class WithdrawalView(generics.GenericAPIView):
    serializer_class = WithdrawalSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        user = request.user

        if user.balance < Decimal(str(data['amount'])):
            return Response(
                {'detail': 'Insufficient balance.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reference = _generate_reference('WIT')

        txn = Transaction.objects.create(
            user=user,
            transaction_type=Transaction.TYPE_WITHDRAWAL,
            method=data['method'],
            amount=data['amount'],
            currency=data['currency'],
            status=Transaction.STATUS_COMPLETED,
            reference=reference,
            phone_number=data.get('phone_number', ''),
        )

        user.balance -= Decimal(str(data['amount']))
        user.save(update_fields=['balance'])

        return Response({
            'success': True,
            'transaction_id': txn.id,
            'reference': reference,
            'message': f"Withdrawal of {data['currency']} {data['amount']:,} processed successfully.",
            'new_balance': str(user.balance),
        }, status=status.HTTP_201_CREATED)


class TransactionHistoryView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['transaction_type', 'status', 'currency']

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-created_at')


class TransactionDetailView(generics.RetrieveAPIView):
    serializer_class = TransactionSerializer

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)


# ---- Admin views ----

class AdminTransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['transaction_type', 'status', 'currency', 'user']
    queryset = Transaction.objects.select_related('user').order_by('-created_at')


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def payment_stats(request):
    from django.db.models import Sum, Count

    deposits = Transaction.objects.filter(
        transaction_type=Transaction.TYPE_DEPOSIT,
        status=Transaction.STATUS_COMPLETED,
    ).aggregate(total=Sum('amount'), count=Count('id'))

    withdrawals = Transaction.objects.filter(
        transaction_type=Transaction.TYPE_WITHDRAWAL,
        status=Transaction.STATUS_COMPLETED,
    ).aggregate(total=Sum('amount'), count=Count('id'))

    return Response({
        'deposits': deposits,
        'withdrawals': withdrawals,
    })
