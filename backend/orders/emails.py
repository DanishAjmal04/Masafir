import os
import base64
from email.mime.text import MIMEText

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from django.conf import settings


def get_gmail_service():
    creds = Credentials(
        token         = None,
        refresh_token = os.environ.get("GMAIL_REFRESH_TOKEN"),
        token_uri     = "https://oauth2.googleapis.com/token",
        client_id     = os.environ.get("GMAIL_CLIENT_ID"),
        client_secret = os.environ.get("GMAIL_CLIENT_SECRET"),
        scopes        = ["https://www.googleapis.com/auth/gmail.send"],
    )
    return build("gmail", "v1", credentials=creds)


def send_gmail(to, subject, body):
    """Gmail API se email bhejo"""
    try:
        service = get_gmail_service()
        message = MIMEText(body)
        message["to"]      = to
        message["from"]    = os.environ.get("GMAIL_USER")
        message["subject"] = subject
        raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
        service.users().messages().send(
            userId="me",
            body={"raw": raw}
        ).execute()
    except Exception as e:
        print(f"Gmail API error: {e}")


def get_order_email(order):
    if order.user:
        return order.user.email
    return order.guest_email or None


def send_admin_new_order_email(order):
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
Admin panel:
https://masafir-backend.up.railway.app/admin/orders/order/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    """

    send_gmail(
        to      = os.environ.get("ADMIN_EMAIL"),
        subject = f"Naya Order: #{order.order_number} — PKR {order.total}",
        body    = message,
    )


def send_user_order_confirmed_email(order):
    recipient = get_order_email(order)
    if not recipient:
        return

    items_text = "\n".join([
        f"  - {item.product_name} | Size: {item.size} | Qty: {item.quantity} | PKR {item.price}"
        for item in order.items.all()
    ])

    message = f"""
Assalam o Alaikum {order.shipping_name},

Aapka order confirm ho gaya hai!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Order Number:  {order.order_number}
Status:        Confirmed

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

Shukriya Masafir choose karne ke liye!

Masafir Team
masafir.store
    """

    send_gmail(
        to      = recipient,
        subject = f"Order Confirm — #{order.order_number} | Masafir",
        body    = message,
    )


def send_user_order_placed_email(order):
    recipient = get_order_email(order)
    if not recipient:
        return

    if order.payment_method == "bank_transfer":
        payment_note = f"""
Aapne bank transfer select kiya hai.
Yeh account mein transfer karein:

Bank:           Meezan Bank
Account Title:  Masafir Clothing
Account Number: 1234567890
IBAN:           PK36MEZN0001234567890123
Amount:         PKR {order.total}

Reference mein order number zaroor likhein: {order.order_number}
Payment confirm hone ke baad order dispatch hoga.
        """
    else:
        payment_note = "Payment delivery pe karni hai (Cash on Delivery)."

    message = f"""
Assalam o Alaikum {order.shipping_name},

Aapka order receive ho gaya hai! Shukriya

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ORDER NUMBER: {order.order_number}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{payment_note}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Koi masla ho toh is email pe reply karein.

Masafir Team
masafir.store
    """

    send_gmail(
        to      = recipient,
        subject = f"Order Receive Hua — #{order.order_number} | Masafir",
        body    = message,
    )