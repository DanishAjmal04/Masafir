from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Order, OrderStatusHistory
from .serializers import (
    OrderListSerializer,
    OrderDetailSerializer,
    PlaceOrderSerializer,
    UpdateOrderStatusSerializer,
)
from .emails import send_admin_new_order_email, send_user_order_placed_email, send_user_order_confirmed_email


class PlaceOrderView(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes     = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        serializer = PlaceOrderSerializer(
            data    = request.data,
            context = {"request": request}
        )
        if serializer.is_valid():
            order = serializer.save()

            # Email fail hone pe order cancel nahi hoga
            # try:
            #     send_admin_new_order_email(order)
            # except Exception as e:
            #     print(f"Admin email failed: {e}")

            # try:
            #     send_user_order_placed_email(order)
            # except Exception as e:
            #     print(f"User email failed: {e}")

            return Response(
                OrderDetailSerializer(order).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyOrdersView(generics.ListAPIView):
    serializer_class   = OrderListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related("items")


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class   = OrderDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field       = "order_number"

    def get_queryset(self):
        return Order.objects.filter(
            user=self.request.user
        ).prefetch_related("items", "history")


class CancelOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, order_number):
        try:
            order = Order.objects.get(order_number=order_number, user=request.user)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        if order.status not in ["pending", "confirmed"]:
            return Response(
                {"detail": f"Order cannot be cancelled at '{order.status}' stage."},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = "cancelled"
        order.save()

        OrderStatusHistory.objects.create(
            order=order, status="cancelled", note="Cancelled by customer."
        )

        return Response({"detail": "Order cancelled successfully."})


# ── Admin Views ────────────────────────────────────────────────────────────

class AllOrdersView(generics.ListAPIView):
    serializer_class   = OrderListSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        qs = Order.objects.all().prefetch_related("items").select_related("user")
        status_filter = self.request.query_params.get("status")
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs


class UpdateOrderStatusView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, order_number):
        try:
            order = Order.objects.get(order_number=order_number)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateOrderStatusSerializer(data=request.data)
        if serializer.is_valid():
            old_status   = order.status
            order.status = serializer.validated_data["status"]

            if order.status == "confirmed":
                order.payment_status = True

            order.save()

            OrderStatusHistory.objects.create(
                order  = order,
                status = order.status,
                note   = serializer.validated_data.get("note", "")
            )

            if order.status == "confirmed" and old_status != "confirmed":
                send_user_order_confirmed_email(order)

            return Response(OrderDetailSerializer(order).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)