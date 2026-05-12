from django.core.mail import send_mail
from django.conf import settings


def get_order_email(order):
    """User ya guest — dono ka email handle karo"""
    if order.user:
        return order.user.email
    return order.guest_email or None


def send_admin_new_order_email(order):
    """Jab order place ho — admin ko mail jaye"""

    items_text = "\n".join([
        f"  - {item.product_name} | Size: {item.size} | Color: {item.color} | Qty: {item.quantity} | PKR {item.price}"
        for item in order.items.all()
    ])

    if order.payment_method == "bank_transfer":
        payment_info = "Payment Method: Bank Transfer"
    elif order.payment_method == "cod":
        payment_info = "Payment Method: Cash on Delivery"
    else:
        payment_info = f"Payment Method: {order.payment_method}"

    # Customer email — user ya guest
    customer_email = get_order_email(order) or "N/A"
    customer_type  = "Registered User" if order.user else "Guest"

    message = f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 MASAFIR — NAYA ORDER AAYA HAI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order Number:  {order.order_number}
Date:          {order.created_at.strftime('%d %B %Y, %I:%M %p')}
Customer Type: {customer_type}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 CUSTOMER INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:     {order.shipping_name}
Phone:    {order.shipping_phone}
Email:    {customer_email}
Address:  {order.shipping_address}
City:     {order.shipping_city}, {order.shipping_province}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ORDER ITEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{items_text}

Subtotal:   PKR {order.subtotal}
Shipping:   PKR {order.shipping_cost}
Total:      PKR {order.total}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PAYMENT INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{payment_info}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Admin panel mein confirm karo:
http://localhost:8000/admin/orders/order/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    """

    send_mail(
        subject        = f"🛍️ Naya Order: #{order.order_number} — PKR {order.total}",
        message        = message,
        from_email     = settings.DEFAULT_FROM_EMAIL,
        recipient_list = [settings.ADMIN_EMAIL],
        fail_silently  = True,
    )


def send_user_order_confirmed_email(order):
    """Jab admin confirm kare — user ko mail jaye"""

    recipient = get_order_email(order)
    if not recipient:
        return  # email nahi hai tou skip

    items_text = "\n".join([
        f"  • {item.product_name} | Size: {item.size} | Qty: {item.quantity} | PKR {item.price}"
        for item in order.items.all()
    ])

    message = f"""
Assalam o Alaikum {order.shipping_name},

Aapka order confirm ho gaya hai! 🎉

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Order Number:  {order.order_number}
Status:        Confirmed ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 AAPKE ITEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{items_text}

Total:  PKR {order.total}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 DELIVERY ADDRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{order.shipping_name}
{order.shipping_phone}
{order.shipping_address}
{order.shipping_city}, {order.shipping_province}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Aapka order 2-3 working days mein deliver ho jayega.
Koi sawaal ho toh reply karein.

Shukriya Masafir choose karne ke liye! 🙏

Masafir Team
masafir.store
    """

    send_mail(
        subject        = f"✅ Order Confirm — #{order.order_number} | Masafir",
        message        = message,
        from_email     = settings.DEFAULT_FROM_EMAIL,
        recipient_list = [recipient],   # ← fix
        fail_silently  = True,
    )


def send_user_order_placed_email(order):
    """Jab order place ho — user ko acknowledgement mail"""

    recipient = get_order_email(order)
    if not recipient:
        return  # email nahi hai tou skip

    if order.payment_method == "bank_transfer":
        payment_note = f"""
Aapne bank transfer select kiya hai.
Agar abhi tak transfer nahi ki toh yeh account mein karein:

Bank:           Meezan Bank
Account Title:  Masafir Clothing
Account Number: 1234567890
IBAN:           PK36MEZN0001234567890123
Amount:         PKR {order.total}

Reference mein apna order number zaroor likhein: {order.order_number}
Payment confirm hone ke baad order dispatch hoga.
        """
    else:
        payment_note = "Payment delivery pe karni hai (Cash on Delivery)."

    message = f"""
Assalam o Alaikum {order.shipping_name},

Aapka order receive ho gaya hai! Shukriya 🙏

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ORDER NUMBER: {order.order_number}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{payment_note}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Koi masla ho toh is email pe reply karein.

Masafir Team
masafir.store
    """

    send_mail(
        subject        = f"Order Receive Hua — #{order.order_number} | Masafir",
        message        = message,
        from_email     = settings.DEFAULT_FROM_EMAIL,
        recipient_list = [recipient],   # ← fix
        fail_silently  = True,
    )